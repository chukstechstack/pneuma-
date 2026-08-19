import React, { useState } from "react";
import { MessageCircle, Send, X, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { addComment, deleteComment } from "../../hooks/interactionsSlice";

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
  const comments = useSelector((state: RootState) => state.interactions.commentsByTask[uuid] || []);
  const [commentInput, setCommentInput] = useState<string>("");

  if (!isOpen) return null;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    dispatch(addComment({ taskUuid: uuid, content: commentInput.trim() }));
    setCommentInput("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#09090b] border-l border-white/10 shadow-2xl flex flex-col">
          
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <MessageCircle size={18} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              <h3 className="font-serif font-bold tracking-wide uppercase text-sm">
                Reflections ({comments.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-20">
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
                    <span className="text-xs font-semibold text-white/90">
                      {comment.authorName}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-white/30">
                        {comment.createdAt}
                      </span>
                      <button
                        onClick={() => dispatch(deleteComment({ taskUuid: uuid, commentId: comment.id }))}
                        className="text-white/20 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed font-normal">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handlePostComment}
            className="p-4 border-t border-white/[0.08] bg-[#010102] flex items-center gap-2"
          >
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Share a thoughtful word..."
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white transition-all"
            />
            <button
              type="submit"
              className="p-3 bg-white/10 border border-white/30 text-white hover:bg-white hover:text-[#010102] transition-all rounded-xl cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};