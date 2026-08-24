import React from "react";
import { MessageCircle, X } from "lucide-react";

interface CommentsHeaderProps {
  count: number;
  onClose: () => void;
}

export const CommentsHeader: React.FC<CommentsHeaderProps> = ({ count, onClose }) => {
  return (
    <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
      <div className="flex items-center gap-2.5 text-white">
        <MessageCircle size={18} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
        <h3 className="font-serif font-bold tracking-wide uppercase text-xs">
          Reflections ({count})
        </h3>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer"
      >
        <X size={15} />
      </button>
    </div>
  );
};