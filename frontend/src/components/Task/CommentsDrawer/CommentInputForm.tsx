import React from "react";
import { Send, Loader2 } from "lucide-react";

interface CommentInputFormProps {
  commentInput: string;
  setCommentInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  userUuid: string | null;
  isSubmitting: boolean;
}

export const CommentInputForm: React.FC<CommentInputFormProps> = ({
  commentInput,
  setCommentInput,
  onSubmit,
  userUuid,
  isSubmitting,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="p-3.5 sm:p-4 border-t border-white/[0.08] bg-[#010102] rounded-b-3xl flex items-center gap-2.5 font-sans"
    >
      <input
        type="text"
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        placeholder={userUuid ? "Add a comment..." : "Sign in to comment..."}
        disabled={!userUuid || isSubmitting}
        className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all disabled:opacity-50 font-sans"
      />
      <button
        type="submit"
        disabled={!userUuid || !commentInput.trim() || isSubmitting}
        className="p-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all rounded-xl cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[44px]"
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin text-[#3897f0]" />
        ) : (
          <Send size={15} />
        )}
      </button>
    </form>
  );
};