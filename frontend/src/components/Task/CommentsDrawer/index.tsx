import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/ReduxStore";
import { addComment, deleteComment } from "../../../hooks/interactionsSlice";
import { useAuthStore } from "@store/useAuthStore";
import { postTaskInteractionApi } from "../../../services/InteractionServices/interactionsService";

import { EMPTY_ARRAY } from "./constants";
import { CommentsHeader } from "./CommentsHeader";
import { CommentsList } from "./CommentsList";
import { CommentInputForm } from "./CommentInputForm";

interface TaskCommentsDrawerProps {
  uuid: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskCommentsDrawer: React.FC<TaskCommentsDrawerProps> = ({
  uuid,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { userUuid } = useAuthStore() as { userUuid: string | null };
  
  const comments = useSelector((state: RootState) => state.interactions.commentsByTask[uuid] || EMPTY_ARRAY);
  
  const [commentInput, setCommentInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !userUuid || isSubmitting) return;

    const contentToPost = commentInput.trim();
    setCommentInput("");
    setIsSubmitting(true);

    try {
      const response = await postTaskInteractionApi(uuid, "ADD_COMMENT", {
        userUuid,
        content: contentToPost,
      });

      if (response && response.success && response.comment) {
        dispatch(
          addComment({
            taskUuid: uuid,
            id: response.comment.id,
            content: response.comment.content,
            authorName: response.comment.author_name || "Sanctuary Member",
            avatarUrl: response.comment.avatar_url || null,
            authorProfileUuid: response.comment.author_profile_uuid,
            createdAt: response.comment.created_at,
          })
        );
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    dispatch(deleteComment({ taskUuid: uuid, commentId }));

    try {
      await postTaskInteractionApi(uuid, "DELETE_COMMENT", {
        commentId,
      });
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:justify-end lg:pr-24">
      {/* Heavy Immersive Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Floating Modal Box */}
      <div className="relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[82vh] z-10 transform transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-12">
        
        <CommentsHeader count={comments.length} onClose={onClose} />

        <CommentsList 
          comments={comments.map(c => ({ ...c, authorProfileUuid: c.authorProfileUuid ?? "" }))} 
          userUuid={userUuid} 
          onDelete={handleDeleteComment} 
        />

        <CommentInputForm 
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          onSubmit={handlePostComment}
          userUuid={userUuid}
          isSubmitting={isSubmitting}
        />

      </div>
    </div>
  );
};