import React from "react";
import { Link } from "react-router-dom";
import { Plus, Check, Loader2 } from "lucide-react";

interface TaskAuthorAvatarProps {
  authorProfileUuid: string;
  authorAvatarUrl?: string | null;
  fallbackUserAvatar: string;
  showFollowBadge?: boolean;
  isFollowing?: boolean;
  isPending?: boolean;
  onFollowClick?: () => void;
}

export const TaskAuthorAvatar: React.FC<TaskAuthorAvatarProps> = ({
  authorProfileUuid,
  authorAvatarUrl,
  fallbackUserAvatar,
  showFollowBadge = false,
  isFollowing = false,
  isPending = false,
  onFollowClick,
}) => {
  return (
    <div className="relative inline-block shrink-0">
      <Link 
        to={`/profile/${authorProfileUuid}`} 
        className="relative block shrink-0 select-none group active:scale-95 transition-transform duration-150 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🌟 TikTok-Sized Larger Avatar Circle */}
        <div className="w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-full p-[2px] flex items-center justify-center bg-black/40 border-2 border-white/30 group-hover:border-[#d4af37] transition-colors shadow-2xl backdrop-blur-md">
          <div className="w-full h-full rounded-full overflow-hidden bg-[#121214]">
            <img
              src={authorAvatarUrl || fallbackUserAvatar}
              alt="author profile"
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="lazy"
            />
          </div>
        </div>
      </Link>

      {/* Floating TikTok-Style Follow / Check Badge */}
      {showFollowBadge && !isFollowing && onFollowClick && (
        <button
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFollowClick();
          }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FE2C55] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer border-2 border-black z-30"
          aria-label="Follow author"
        >
          {isPending ? (
            <Loader2 size={12} className="animate-spin text-white" />
          ) : (
            <Plus size={14} strokeWidth={3} />
          )}
        </button>
      )}
    </div>
  );
};