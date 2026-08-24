import React, { useRef, useEffect } from "react";
import { X, Send, Loader2, Check, Clock, MessageSquare } from "lucide-react";
import { useChatDock } from "@/hooks/useChatDock";

interface ChatDockProps {
  targetProfileUuid: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDock: React.FC<ChatDockProps> = ({ targetProfileUuid, isOpen, onClose }) => {
  const {
    currentUserUuid,
    inputMessage,
    setInputMessage,
    messages,
    isLoading,
    isError,
    handleSendMessage,
  } = useChatDock(targetProfileUuid, isOpen);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Centered Modal Container */}
      <div className="w-full max-w-lg h-[550px] bg-[#121214] border border-white/[0.1] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#09090b]/90 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <MessageSquare size={16} />
            </div>
            <div>
              <span className="font-serif text-sm font-semibold text-white tracking-wide block">
                Direct Message
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live connection active
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-[#09090b]/40">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-white/40 gap-2 text-xs">
              <Loader2 size={18} className="animate-spin text-[#d4af37]" />
              <span>Loading conversation history...</span>
            </div>
          )}

          {isError && (
            <div className="text-center py-20 text-rose-400 text-xs">
              Failed to load messages. Please try again.
            </div>
          )}

          {!isLoading && messages.map((msg) => {
            const isMe = msg.senderUuid === currentUserUuid;
            return (
              <div 
                key={msg.id || msg.tempId} 
                className={`flex flex-col gap-1 max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
              >
                <div 
                  className={`text-xs px-4 py-3 rounded-2xl leading-relaxed ${
                    isMe 
                      ? "bg-[#d4af37] text-black font-medium rounded-tr-sm shadow-md" 
                      : "bg-white/[0.06] text-white/90 rounded-tl-sm border border-white/[0.04]"
                  }`}
                >
                  {msg.content}
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="text-[9px] text-white/30">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    msg.pending ? (
                      <Clock size={10} className="text-white/30 animate-pulse" />
                    ) : (
                      <Check size={10} className="text-[#d4af37]" />
                    )
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#121214] border-t border-white/[0.06] flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#09090b] border border-white/10 rounded-full px-5 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-all shadow-inner"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] text-black flex items-center justify-center hover:opacity-95 transition-all shrink-0 cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};