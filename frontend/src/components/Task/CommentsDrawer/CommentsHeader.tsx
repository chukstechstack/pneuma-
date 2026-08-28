import React from "react";
import { MessageCircle, X } from "lucide-react";

interface CommentsHeaderProps {
  count: number;
  onClose: () => void;
}

export const CommentsHeader: React.FC<CommentsHeaderProps> = ({ count, onClose }) => {
  return (
    <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between font-sans shrink-0">
      <div className="flex items-center gap-2.5 text-white">
        <MessageCircle size={18} className="text-[#3897f0]" />
        <h3 className="font-sans font-bold tracking-tight uppercase text-xs sm:text-sm text-white">
          Comments ({count})
        </h3>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer"
      >
        <X size={15} />
      </button>
    </div>
  );
};