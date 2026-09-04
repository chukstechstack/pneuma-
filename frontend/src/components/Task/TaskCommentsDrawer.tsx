import React, { useState } from "react";
import { MessageCircle, Send, X, Loader2, Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { addComment, deleteComment } from "../../hooks/interactionsSlice";
import { useAuthStore } from "@store/useAuthStore";
import { postTaskInteractionApi } from "../../services/InteractionServices/interactionsService";

interface TaskCommentsDrawerProps {
  uuid: string;
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_ARRAY: any[] = [];

const fallbackAvatar =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20762%20762%22%20fill%3D%22none%22%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22381%22%20r%3D%22381%22%20fill%3D%22%23e5e7eb%22%2F%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22300%22%20r%3D%22120%22%20fill%3D%22%239ca3af%22%20%2F%3E%3Cpath%20d%3D%22M181%20600c0-110%2090-200%20200-200s200%2090%20200%20200%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%2240%22%20stroke-linecap%3D%22round%22%20%2F%3E%3C%2Fsvg%3E";

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
            authorName: response.comment.author_name || "Member",
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
    // 🌟 Increased z-index to z-[100] so no nav or PC element can ever cover it
    <div className="fixed inset-0 z-[100] flex items-end justify-center font-sans">
      {/* Immersive Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full max-w-lg bg-[#fbfbfd] text-gray-900 rounded-t-[36px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col h-[85vh] sm:max-h-[90vh] z-10 transform transition-transform duration-300 ease-out animate-in slide-in-from-bottom border-t border-gray-200">
        
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3.5" />

        {/* Header */}
        <div className="px-7 py-3 border-b border-gray-200/60 flex items-center justify-between">
          <div className="w-10" />
          <h3 className="font-bold text-lg text-gray-900 tracking-tight">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-200/60 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
            aria-label="Close comments"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Comments Scrollable Feed */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
          {comments.length === 0 ? (
            <div className="text-center py-28 flex flex-col items-center justify-center gap-3">
              <MessageCircle size={48} className="text-gray-300" />
              <p className="text-gray-400 text-base font-medium">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-4 group relative"
              >
                <img
                  src={comment.avatarUrl || fallbackAvatar}
                  alt={comment.authorName}
                  className="w-14 h-14 rounded-full object-cover bg-gray-200 shrink-0 mt-0.5 shadow-sm border border-gray-200"
                />

                <div className="flex-1 flex flex-col pr-12">
                  <span className="text-lg font-semibold text-gray-600 mb-1 tracking-tight">
                    {comment.authorName}
                  </span>
                  
                  <p className="text-xl text-gray-900 leading-relaxed font-normal whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center gap-5 mt-2.5">
                    <span className="text-xs text-gray-400 font-medium">
                      {comment.createdAt}
                    </span>
                    {userUuid && comment.authorProfileUuid === userUuid && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-gray-400 hover:text-red-600 transition-colors cursor-pointer font-semibold"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <button className="absolute right-0 top-3 flex flex-col items-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1">
                  <Heart size={20} strokeWidth={2} />
                  <span className="text-xs text-gray-400 font-medium mt-1">0</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={handlePostComment}
          className="p-4 px-7 border-t border-gray-200/60 bg-white flex items-center gap-3.5 shadow-[0_-6px_25px_rgba(0,0,0,0.05)]"
        >
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={userUuid ? "Add comment..." : "Sign in to comment..."}
            disabled={!userUuid || isSubmitting}
            className="flex-1 bg-gray-100 border border-gray-200 focus:border-gray-400 rounded-full px-6 py-4 text-xl text-gray-900 placeholder-gray-400 focus:outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!userUuid || !commentInput.trim() || isSubmitting}
            className="w-14 h-14 bg-black text-white hover:bg-gray-800 active:scale-95 transition-all rounded-full flex items-center justify-center cursor-pointer disabled:opacity-20 disabled:pointer-events-none shrink-0 shadow-md"
            aria-label="Send comment"
          >
            {isSubmitting ? (
              <Loader2 size={22} className="animate-spin text-white" />
            ) : (
              <Send size={22} strokeWidth={2.25} className="translate-x-0.5" />
            )}
          </button>
        </form>

      </div>
    </div>
  );
};