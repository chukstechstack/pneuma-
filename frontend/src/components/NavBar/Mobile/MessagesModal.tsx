import React, { useState, useEffect } from "react";
import { MessageSquare, Loader2, X } from "lucide-react";
import { useFetchConversations } from "../../../hooks/useFetchConversations";
import socket from "@/api/socketApi";
import { useAuthStore } from "@store/useAuthStore";

interface MobileMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (partnerUuid: string) => void;
}

export const MobileMessagesModal: React.FC<MobileMessagesModalProps> = ({
  isOpen,
  onClose,
  onSelectConversation,
}) => {
  const { userUuid: currentUserUuid } = useAuthStore() as { userUuid: string | null };
  const { data: conversations = [], isLoading, isError, refetch } = useFetchConversations(isOpen);

  // 🔴 Live Unread Count State for Mobile
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Listen for incoming messages globally to increment unread counter
  useEffect(() => {
    const handleGlobalIncomingMessage = (incoming: any) => {
      if (incoming.senderUuid !== currentUserUuid) {
        setUnreadCount((prev) => prev + 1);
        refetch();
      }
    };

    socket.on("server:incoming_msg", handleGlobalIncomingMessage);

    return () => {
      socket.off("server:incoming_msg", handleGlobalIncomingMessage);
    };
  }, [currentUserUuid, refetch]);

  // When closing the modal or selecting a chat, you can clear unread if desired, 
  // or clear it when the modal is fully opened/viewed.
  const handleCloseModal = () => {
    setUnreadCount(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200 md:hidden">
      <div className="bg-[#121214] border-t border-white/[0.08] rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-[#d4af37]" />
            <span className="font-serif text-sm font-semibold text-white tracking-wide">Messages</span>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={handleCloseModal}
            className="text-white/50 hover:text-white p-2 rounded-full bg-white/[0.04] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body List */}
        <div className="overflow-y-auto divide-y divide-white/[0.04] p-2">
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-white/40 gap-2 text-xs">
              <Loader2 size={16} className="animate-spin text-[#d4af37]" />
              <span>Fetching chats...</span>
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-rose-400 text-xs px-4">
              Failed to load conversations.
            </div>
          )}

          {!isLoading && !isError && conversations.length === 0 && (
            <div className="text-center py-16 text-white/40 text-xs px-4">
              No messages yet.
            </div>
          )}

          {!isLoading &&
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setUnreadCount(0);
                  onSelectConversation(conv.partnerUuid);
                  onClose();
                }}
                className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-white/[0.04] active:bg-white/[0.08] rounded-2xl cursor-pointer transition-colors"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10">
                  <img
                    src={conv.partnerAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt={conv.partnerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white truncate">
                      {conv.partnerName}
                    </span>
                    <span className="text-[10px] text-white/30 shrink-0">
                      {new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 truncate font-light">
                    {conv.content}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};