import React from "react";
import { MessageSquare, Loader2, X } from "lucide-react";
import { useFetchConversations } from "../../../hooks/useFetchConversations";

interface DesktopMessagesDropdownProps {
  isOpen: boolean;
  onToggle: () => void; // ⚡ Explicit toggle function
  onClose: () => void;
  onSelectConversation: (partnerUuid: string) => void;
  getLinkClasses: (path: string) => string;
}

export const DesktopMessagesDropdown: React.FC<DesktopMessagesDropdownProps> = ({
  isOpen,
  onToggle,
  onClose,
  onSelectConversation,
  getLinkClasses,
}) => {
  const { data: conversations = [], isLoading, isError } = useFetchConversations(isOpen);

  return (
    <div className="relative">
      {/* ✅ Clean click handler directly on the button */}
      <button
        onClick={onToggle}
        className={getLinkClasses("/messages")}
      >
        <div className="relative flex items-center">
          <MessageSquare size={15} strokeWidth={isOpen ? 2 : 1.5} />
          <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-md">
            9
          </span>
        </div>
        <span className="ml-1">Messages</span>
      </button>

      {/* Pop-up Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <span className="font-serif text-xs font-semibold text-white tracking-wide">Conversations</span>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent bubbling up to toggle
                onClose();
              }} 
              className="text-white/40 hover:text-white p-1 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* List Body */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-white/[0.04]">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-white/40 gap-2 text-xs">
                <Loader2 size={14} className="animate-spin text-[#d4af37]" />
                <span>Fetching chats...</span>
              </div>
            )}

            {isError && (
              <div className="text-center py-8 text-rose-400 text-xs px-4">
                Failed to load conversations.
              </div>
            )}

            {!isLoading && !isError && conversations.length === 0 && (
              <div className="text-center py-10 text-white/40 text-xs px-4">
                No messages yet.
              </div>
            )}

            {!isLoading &&
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.partnerUuid);
                    onClose();
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors group"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10 group-hover:ring-[#d4af37]/50 transition-all">
                    <img
                      src={conv.partnerAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={conv.partnerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-white truncate group-hover:text-[#d4af37] transition-colors">
                        {conv.partnerName}
                      </span>
                      <span className="text-[9px] text-white/30 shrink-0">
                        {new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 truncate font-light">
                      {conv.content}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};