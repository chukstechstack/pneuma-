import React from "react";
import { Trash2 } from "lucide-react";
import { CommentType, fallbackAvatar } from "./constants";

interface CommentItemProps {
  comment: CommentType;
  userUuid: string | null;
  onDelete: (commentId: number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, userUuid, onDelete }) => {
  const isOwner = userUuid && comment.authorProfileUuid === userUuid;

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2 group relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={comment.avatarUrl || fallbackAvatar}
            alt={comment.authorName}
            className="w-6 h-6 rounded-full object-cover border border-white/10"
          />
          <span className="text-xs font-semibold text-white/90">
            {comment.authorName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/30">
            {comment.createdAt}
          </span>
          {isOwner && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-white/20 hover:text-red-400 transition-colors cursor-pointer"
              title="Delete comment"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-200 leading-relaxed font-normal pl-8.5">
        {comment.content}
      </p>
    </div>
  );
};