import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/ReduxStore"; 
import { toggleShare, toggleLike } from "../../hooks/interactionsSlice"; 
import { TaskCommentsDrawer } from "./TaskCommentsDrawer";

interface TaskActionsProps {
  uuid: string;
  is_liked?: boolean;
  is_reposted?: boolean;
  likes_count?: number;
  reposts_count?: number;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  uuid,
  likes_count,
  reposts_count,
}) => {
  const dispatch = useDispatch();

  // Redux state selectors
  const comments = useSelector((state: RootState) => state.interactions.commentsByTask[uuid] || []);
  
  // Like selectors
  const isLiked = useSelector((state: RootState) => state.interactions.isLikedByTask[uuid] || false);
  const customLikesCount = useSelector((state: RootState) => state.interactions.likesCountByTask[uuid] || 0);

  // Share selectors
  const isShared = useSelector((state: RootState) => state.interactions.isSharedByTask[uuid] || false);
  const customSharesCount = useSelector((state: RootState) => state.interactions.sharesCountByTask[uuid] || 0);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const hasComments = comments.length > 0;
  const defaultActionClass = "text-white/40";
  const textCounterClass = "text-xs font-medium";

  const handleShareAction = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/patchfeed/${uuid}`);
      setCopied(true);
      dispatch(toggleShare(uuid));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <>
      <div className="flex items-center gap-8 pt-3 pb-2 sm:pb-0 border-t border-white/[0.04] mt-4">
        
        {/* Like Button (Connected to Redux) */}
        <button
          onClick={() => dispatch(toggleLike(uuid))}
          className={`flex items-center gap-2 transition-colors cursor-pointer group ${
            isLiked ? "text-rose-500" : `hover:text-white ${defaultActionClass}`
          }`}
        >
          <Heart 
            size={18} 
            strokeWidth={1.5}
            className={`transition-transform duration-200 group-hover:scale-110 ${
              isLiked ? "fill-rose-500 text-rose-500" : ""
            }`} 
          />
          <span className={textCounterClass}>
            {(likes_count || 0) + customLikesCount}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`flex items-center gap-2 transition-all duration-300 cursor-pointer group ${
            hasComments ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" : defaultActionClass + " hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
          }`}
        >
          <MessageCircle 
            size={18} 
            strokeWidth={1.5} 
            className={`transition-transform duration-200 group-hover:scale-110 ${
              hasComments ? "text-white fill-white/10" : ""
            }`} 
          />
          <span className={textCounterClass}>{comments.length}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShareAction}
          className={`flex items-center gap-2 transition-colors cursor-pointer group ${
            isShared ? "text-emerald-400" : `hover:text-white ${defaultActionClass}`
          }`}
        >
          <Share2 
            size={18} 
            strokeWidth={1.5}
            className={`transition-transform duration-200 group-hover:scale-110 ${
              isShared ? "text-emerald-400" : ""
            }`} 
          />
          <span className={textCounterClass}>
            {copied ? "Copied!" : ((reposts_count || 0) + customSharesCount)}
          </span>
        </button>
      </div>

      <TaskCommentsDrawer
        uuid={uuid}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};