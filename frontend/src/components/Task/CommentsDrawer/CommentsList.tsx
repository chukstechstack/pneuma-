import React from "react";
import { CommentItem } from "./CommentItem";
import { CommentType } from "./constants";

interface CommentsListProps {
  comments: CommentType[];
  userUuid: string | null;
  onDelete: (commentId: number) => void;
}

export const CommentsList: React.FC<CommentsListProps> = ({ comments, userUuid, onDelete }) => {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      {comments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-xs uppercase tracking-widest font-mono">
            No reflections yet. Add your voice below.
          </p>
        </div>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            userUuid={userUuid}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};