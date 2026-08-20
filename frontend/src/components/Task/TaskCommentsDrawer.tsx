import React, { useState } from "react";
import { MessageCircle, Send, X, Trash2, Loader2 } from "lucide-react";
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

// Stable reference fallback array to prevent unnecessary re-renders
const EMPTY_ARRAY: any[] = [];

const fallbackAvatar =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20762%20762%22%20fill%3D%22none%22%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22381%22%20r%3D%22381%22%20fill%3D%22%23161618%22%2F%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22300%22%20r%3D%22120%22%20fill%3D%22%238e92a2%22%20%2F%3E%3Cpath%20d%3D%22M181%20600c0-110%2090-200%20200-200s200%2090%20200%20200%22%20stroke%3D%22%238e92a2%22%20stroke-width%3D%2240%22%20stroke-linecap%3D%22round%22%20%2F%3E%3C%2Fsvg%3E";

export const TaskCommentsDrawer: React.FC<TaskCommentsDrawerProps> = ({
  uuid,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { userUuid } = useAuthStore() as { userUuid: string | null };
  
  // Redux state selector
  const comments = useSelector((state: RootState) => state.interactions.commentsByTask[uuid] || EMPTY_ARRAY);
  
  const [commentInput, setCommentInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // 1. Post Comment with Backend Sync
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

  // 2. Delete Comment with Backend Sync
  const handleDeleteComment = async (commentId: number) => {
    // Optimistic Redux removal
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
      {/* Heavy Immersive Backdrop with Smooth Fade */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Floating Modal Box with Slow-Motion Slide-Up Animation */}
      <div className="relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[82vh] z-10 transform transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-12">
        
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-white">
            <MessageCircle size={18} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            <h3 className="font-serif font-bold tracking-wide uppercase text-xs">
              Reflections ({comments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-mono">
                No reflections yet. Add your voice below.
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2 group relative"
              >
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
                    {userUuid && comment.authorProfileUuid === userUuid && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
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
            ))
          )}
        </div>

        {/* Comment Input Form */}
        <form
          onSubmit={handlePostComment}
          className="p-4 border-t border-white/[0.08] bg-[#010102] rounded-b-3xl flex items-center gap-2"
        >
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={userUuid ? "Share a thoughtful word..." : "Sign in to reflect..."}
            disabled={!userUuid || isSubmitting}
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!userUuid || !commentInput.trim() || isSubmitting}
            className="p-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all rounded-xl cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[44px]"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </form>

      </div>
    </div>
  );
};