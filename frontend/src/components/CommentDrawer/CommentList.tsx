
import React from "react";

interface CommentListProps {
  comments: any[];
  isLoading: boolean;
}

 const CommentList: React.FC<CommentListProps> = ({ comments, isLoading }) => {
  return (
    <div className="comments-list-box">
      {isLoading ? (
        <p>Loading thoughts...</p>
      ) : comments.length === 0 ? (
        <p>No thoughts recorded yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.uuid || comment.id} className="comment-item">
            <strong>{comment.author_name || "Anonymous"}</strong>
            <p>{comment.comment_text}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList