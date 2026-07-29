import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios.js";
import "@styles/Profile.css";

const CommentDrawer = ({ contentUuid, onClose }) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", contentUuid],
    queryFn: async () => {
      const res = await api.get(`/task/${contentUuid}/fetchComments`);
      return res.data.comments || [];
    },
  });

  const mutation = useMutation({
    mutationFn: (newComment) =>
      api.post(`/task/${contentUuid}/comments`, { comment_text: newComment }),

    onMutate: async (newCommentText) => {
      await queryClient.cancelQueries(["comments", contentUuid]);

      const previousComments = queryClient.getQueryData([
        "comments",
        contentUuid,
      ]);

      queryClient.setQueryData(["comments", contentUuid], (old) => [
        ...old,
        {
          uuid: "temp-" + Date.now(),
          comment_text: newCommentText,
          author_name: "You (Posting...)",
        },
      ]);

      setCommentText("");

      return { previousComments };
    },

    onError: (err, newComment, context) => {
      queryClient.setQueryData(
        ["comments", contentUuid],
        context.previousComments,
      );
      setCommentText(newComment);
      alert("Could not post comment.");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["comments", contentUuid]);
    },
  });
  const handleSend = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    mutation.mutate(commentText);
  };

  return (
    <div className="comment-drawer-root">
      <div className="drawer-header">
        <h3>Comments ({comments.length})</h3>
        {mutation.isPending && <span className="sync-status">Posting...</span>}
      </div>

      <button className="close-drawer-btn" onClick={onClose}>
        Close Drawer
      </button>

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

      <form className="comment-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="write a reply..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={mutation.isPending}
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "..." : "send"}
        </button>
      </form>
    </div>
  );
};

export default CommentDrawer;
