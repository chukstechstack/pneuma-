import React from "react";
import { Link } from "react-router-dom";
import { useTaskProfile } from "../../../hooks/useProfileSettings";
import { formatTaskDate } from "./utils";

interface TaskAuthorMetaProps {
  authorProfileUuid: string;
  authorName?: string | null;
  createdAt?: string | null;
}

export const TaskAuthorMeta: React.FC<TaskAuthorMetaProps> = ({
  authorProfileUuid,
  authorName: initialAuthorName,
  createdAt,
}) => {
  const { data: profile } = useTaskProfile(authorProfileUuid);
  const authorName = profile?.full_name || initialAuthorName;

  return (
    <div className="flex flex-col justify-center min-w-0 font-sans">
      <Link 
        to={`/profile/${authorProfileUuid}`} 
        onClick={(e) => e.stopPropagation()} 
        className="font-extrabold text-white text-base sm:text-lg hover:text-white/80 transition-colors tracking-tight truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
      >
        @{authorName || "pneuma_user"}
      </Link>

      {createdAt && (
        <span className="text-white/70 text-xs sm:text-sm font-medium tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-0.5">
          {formatTaskDate(createdAt)}
        </span>
      )}
    </div>
  );
};