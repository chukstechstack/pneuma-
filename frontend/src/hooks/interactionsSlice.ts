import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommentItem {
  id: string;
  taskUuid: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface InteractionsState {
  commentsByTask: Record<string, CommentItem[]>;
  sharesCountByTask: Record<string, number>;
  isSharedByTask: Record<string, boolean>;
  likesCountByTask: Record<string, number>;
  isLikedByTask: Record<string, boolean>;
}

const initialState: InteractionsState = {
  commentsByTask: {},
  sharesCountByTask: {},
  isSharedByTask: {},
  likesCountByTask: {},
  isLikedByTask: {},
};

export const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {
    addComment: (
      state,
      action: PayloadAction<{ taskUuid: string; content: string; authorName?: string }>
    ) => {
      const { taskUuid, content, authorName } = action.payload;
      if (!state.commentsByTask[taskUuid]) {
        state.commentsByTask[taskUuid] = [];
      }

      const newComment: CommentItem = {
        id: Date.now().toString(),
        taskUuid,
        authorName: authorName || "Sanctuary Member",
        content,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      state.commentsByTask[taskUuid].unshift(newComment);
    },

    deleteComment: (state, action: PayloadAction<{ taskUuid: string; commentId: string }>) => {
      const { taskUuid, commentId } = action.payload;
      if (state.commentsByTask[taskUuid]) {
        state.commentsByTask[taskUuid] = state.commentsByTask[taskUuid].filter(
          (c) => c.id !== commentId
        );
      }
    },

    toggleShare: (state, action: PayloadAction<string>) => {
      const taskUuid = action.payload;
      const currentStatus = state.isSharedByTask[taskUuid] || false;
      const currentCount = state.sharesCountByTask[taskUuid] || 0;

      state.isSharedByTask[taskUuid] = !currentStatus;
      state.sharesCountByTask[taskUuid] = !currentStatus 
        ? currentCount + 1 
        : Math.max(0, currentCount - 1);
    },

    toggleLike: (state, action: PayloadAction<string>) => {
      const taskUuid = action.payload;
      const currentStatus = state.isLikedByTask[taskUuid] || false;
      const currentCount = state.likesCountByTask[taskUuid] || 0;

      state.isLikedByTask[taskUuid] = !currentStatus;
      state.likesCountByTask[taskUuid] = !currentStatus 
        ? currentCount + 1 
        : Math.max(0, currentCount - 1);
    },
  },
});

export const { addComment, deleteComment, toggleShare, toggleLike } = interactionsSlice.actions;
export default interactionsSlice.reducer;