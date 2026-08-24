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
    <Link to={`/profile/${authorProfileUuid}`} className="relative block shrink-0">
      <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10">
        <img
          src={authorAvatarUrl || fallbackUserAvatar}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
    </Link>
  );
};