import React, { useRef, useEffect } from "react";
import { Loader2, Send, X } from "lucide-react";
import { useChatDock } from "../../hooks/useChatDock";

interface MessageInboxDockProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfileUuid: string;
  targetFullName: string;
  targetAvatarUrl: string;
}

export const MessageInboxDock: React.FC<MessageInboxDockProps> = ({
  isOpen,
  onClose,
  targetProfileUuid,
  targetFullName,
  targetAvatarUrl,
}) => {
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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Centered PC Modal Container */}
      <div className="w-full max-w-lg h-[600px] bg-[#09090b] border border-white/10 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#010102]">
          <div className="flex items-center gap-3">
            <img 
              src={targetAvatarUrl} 
              alt={targetFullName} 
              className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/40" 
            />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
                {targetFullName}
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sanctuary Chat
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message History Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#010102]/50">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <Loader2 size={24} className="text-[#d4af37] animate-spin" />
              <p className="text-xs font-mono uppercase tracking-widest">Opening secure channel...</p>
            </div>
          ) : isError ? (
            <div className="h-full flex items-center justify-center text-center text-red-400 text-xs font-mono">
              Failed to load conversation history.
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 text-xs font-mono px-6">
              <p>No messages yet with {targetFullName}.</p>
              <p className="mt-1 text-[10px] text-gray-600">Send a message below to start the conversation.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderUuid === currentUserUuid;
              return (
                <div key={msg.id || msg.tempId} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${isMe ? "bg-[#d4af37]/20 border border-[#d4af37]/40 text-white" : "bg-white/[0.04] border border-white/10 text-gray-200"}`}>
                    {msg.content}
                  </div>
                  {msg.pending && <span className="text-[9px] font-mono text-gray-500 mt-1">Sending...</span>}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-[#010102] flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${targetFullName}...`}
            className="flex-1 bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] font-mono transition-all"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-[#d4af37] text-[#010102] hover:bg-[#e6be42] transition-all cursor-pointer shadow-md"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};