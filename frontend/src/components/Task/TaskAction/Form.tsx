import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface TaskActionFormProps {
  uuid: string;
  isLiked: boolean;
  totalLikes: number;
  commentsCount: number;
  hasComments: boolean;
  isShared: boolean;
  totalShares: number;
  copied: boolean;
  onLike: () => void;
  onOpenDrawer: () => void;
  onShare: () => void;
  isFloatingOverlay?: boolean;
}

export const TaskActionForm: React.FC<TaskActionFormProps> = ({
  isLiked,
  totalLikes,
  commentsCount,
  isShared,
  totalShares,
  copied,
  onLike,
  onOpenDrawer,
  onShare,
  isFloatingOverlay = false,
}) => {
  if (isFloatingOverlay) {
    return (
      <div className="absolute right-3 bottom-20 sm:bottom-24 z-20 flex flex-col items-center gap-4 font-sans pointer-events-none transform-gpu">
        {/* 1. Like Action */}
        <button
          onClick={onLike}
          className="group flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none p-0 pointer-events-auto"
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/60 border border-white/10 transition-transform active:scale-95 ${
            isLiked ? "text-rose-500 bg-rose-500/20 border-rose-500/30" : "text-white"
          }`}>
            <Heart size={22} strokeWidth={2} className={`transition-transform duration-150 ${isLiked ? "fill-rose-500 text-rose-500" : "fill-transparent text-white"}`} />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-white">{totalLikes}</span>
        </button>

        {/* 2. Comment Action */}
        <button
          onClick={onOpenDrawer}
          className="group flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none p-0 pointer-events-auto"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/60 border border-white/10 text-white transition-transform active:scale-95">
            <MessageCircle size={21} strokeWidth={2} />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-white">{commentsCount}</span>
        </button>

        {/* 3. Share Action */}
        <button
          onClick={onShare}
          className="group flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none p-0 pointer-events-auto"
        >
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-black/60 border border-white/10 transition-transform active:scale-95 ${
            isShared || copied ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/30" : "text-white"
          }`}>
            <Share2 size={21} strokeWidth={2} className={`${isShared || copied ? "fill-emerald-400 text-emerald-400" : "fill-transparent text-white"}`} />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-white">
            {copied ? "Copied" : totalShares}
          </span>
        </button>
      </div>
    );
  }

  // Default horizontal bottom bar layout fallback
  const textCounterClass = "text-xs font-medium text-white/80 font-sans";

  return (
    <div className="flex items-center justify-start gap-7 sm:gap-8 pt-3 pb-2 sm:pb-0 border-t border-white/[0.04] mt-4 font-sans">
      <button onClick={onLike} className={`flex items-center gap-2 py-1 px-0 transition-colors cursor-pointer group rounded-lg active:bg-white/5 ${isLiked ? "text-rose-500" : "text-rose-500/70 hover:text-rose-500"}`}>
        <Heart size={19} strokeWidth={1.75} className={`transition-transform duration-200 group-hover:scale-110 ${isLiked ? "fill-rose-500 text-rose-500" : "fill-transparent text-rose-500"}`} />
        <span className={textCounterClass}>{totalLikes}</span>
      </button>

      <button onClick={onOpenDrawer} className="flex items-center gap-2 py-1 px-0 transition-all duration-300 cursor-pointer group text-white/90 hover:text-white rounded-lg active:bg-white/5">
        <MessageCircle size={19} strokeWidth={1.75} className="transition-transform duration-200 group-hover:scale-110 text-white fill-white/10" />
        <span className={textCounterClass}>{commentsCount}</span>
      </button>

      <button onClick={onShare} className={`flex items-center gap-2 py-1 px-0 transition-colors cursor-pointer group rounded-lg active:bg-white/5 ${isShared || copied ? "text-emerald-400" : "text-emerald-400/70 hover:text-emerald-400"}`}>
        <Share2 size={19} strokeWidth={1.75} className={`transition-transform duration-200 group-hover:scale-110 ${isShared || copied ? "fill-emerald-400 text-emerald-400" : "fill-transparent text-emerald-400"}`} />
        <span className={textCounterClass}>{copied ? "Copied!" : totalShares}</span>
      </button>
    </div>
  );
};