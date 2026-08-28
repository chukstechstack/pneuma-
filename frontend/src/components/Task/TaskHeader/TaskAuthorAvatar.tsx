import React from "react";
import { Link } from "react-router-dom";

interface TaskAuthorAvatarProps {
  authorProfileUuid: string;
  authorAvatarUrl?: string | null;
  fallbackUserAvatar: string;
}

export const TaskAuthorAvatar: React.FC<TaskAuthorAvatarProps> = ({
  authorProfileUuid,
  authorAvatarUrl,
  fallbackUserAvatar,
}) => {
  return (
    <Link 
      to={`/profile/${authorProfileUuid}`} 
      className="relative block shrink-0 select-none group active:scale-95 transition-transform duration-150 ease-out"
    >
      {/* 
        Instagram Style Outer Circle Ring:
        Responsive sizing: 32px on mobile (matching IG mobile web), scaling up to 40px on desktop.
      */}
      <div className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full p-[2px] flex items-center justify-center bg-transparent border border-white/[0.15] group-hover:border-white/30 transition-colors">
        <div className="w-full h-full rounded-full overflow-hidden bg-[#121214]">
          <img
            src={authorAvatarUrl || fallbackUserAvatar}
            alt="profile"
            className="w-full h-full object-cover select-none pointer-events-none"
            loading="lazy"
          />
        </div>
      </div>
    </Link>
  );
};