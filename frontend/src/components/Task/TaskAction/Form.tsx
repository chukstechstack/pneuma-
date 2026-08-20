import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { TaskCommentsDrawer } from "../TaskCommentsDrawer"; // Adjust path as needed

interface TaskActionFormProps {
  uuid: string;
  isLiked: boolean;
  totalLikes: number;
  commentsCount: number;
  hasComments: boolean;
  isShared: boolean;
  totalShares: number;
  copied: boolean;
  isDrawerOpen: boolean;
  onLike: () => void;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  onShare: () => void;
}

export const TaskActionForm: React.FC<TaskActionFormProps> = ({
  uuid,
  isLiked,
  totalLikes,
  commentsCount,
  hasComments,
  isShared,
  totalShares,
  copied,
  isDrawerOpen,
  onLike,
  onOpenDrawer,
  onCloseDrawer,
  onShare,
}) => {
  const textCounterClass = "text-xs font-medium text-white/80";

  return (
    <>
      <div className="flex items-center gap-8 pt-3 pb-2 sm:pb-0 border-t border-white/[0.04] mt-4">
        
        {/* Like Button: Unfilled Red Outline -> Clicked Solid Red Fill */}
        <button
          onClick={onLike}
          className={`flex items-center gap-2 transition-colors cursor-pointer group ${
            isLiked ? "text-rose-500" : "text-rose-500/70 hover:text-rose-500"
          }`}
        >
          <Heart
            size={18}
            strokeWidth={1.75}
            className={`transition-transform duration-200 group-hover:scale-110 ${
              isLiked ? "fill-rose-500 text-rose-500" : "fill-transparent text-rose-500"
            }`}
          />
          <span className={textCounterClass}>{totalLikes}</span>
        </button>

        {/* Comment Button: White icon & text */}
        <button
          onClick={onOpenDrawer}
          className={`flex items-center gap-2 transition-all duration-300 cursor-pointer group text-white/90 hover:text-white`}
        >
          <MessageCircle
            size={18}
            strokeWidth={1.75}
            className={`transition-transform duration-200 group-hover:scale-110 text-white fill-white/10`}
          />
          <span className={textCounterClass}>{commentsCount}</span>
        </button>

        {/* Share Button: Unfilled Green Outline -> Clicked Solid Green Fill */}
        <button
          onClick={onShare}
          className={`flex items-center gap-2 transition-colors cursor-pointer group ${
            isShared || copied ? "text-emerald-400" : "text-emerald-400/70 hover:text-emerald-400"
          }`}
        >
          <Share2
            size={18}
            strokeWidth={1.75}
            className={`transition-transform duration-200 group-hover:scale-110 ${
              isShared || copied ? "fill-emerald-400 text-emerald-400" : "fill-transparent text-emerald-400"
            }`}
          />
          <span className={textCounterClass}>
            {copied ? "Copied!" : totalShares}
          </span>
        </button>
      </div>

      <TaskCommentsDrawer
        uuid={uuid}
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
      />
    </>
  );
};