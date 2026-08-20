import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommentItem {
  id: number; // Updated to number to match backend SERIAL primary key
  taskUuid: string;
  authorName: string;
  avatarUrl?: string | null;
  authorProfileUuid?: string;
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

// 1. Load initial state safely from localStorage
const loadInitialState = (): InteractionsState => {
  try {
    const saved = localStorage.getItem("pneuma_interactions_state");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error("Failed to load interactions from localStorage", err);
  }
  return {
    commentsByTask: {},
    sharesCountByTask: {},
    isSharedByTask: {},
    likesCountByTask: {},
    isLikedByTask: {},
  };
};

const saveToLocalStorage = (state: InteractionsState) => {
  try {
    localStorage.setItem("pneuma_interactions_state", JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save interactions state to localStorage", err);
  }
};

const initialState: InteractionsState = loadInitialState();

export const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {
    // Populates Redux with data fetched from the backend API
    setTaskInteractions: (
      state,
      action: PayloadAction<{
        taskUuid: string;
        likes_count: number;
        shares_count: number;
        comments: any[];
      }>
    ) => {
      const { taskUuid, likes_count, shares_count, comments } = action.payload;

      if (comments) {
        state.commentsByTask[taskUuid] = comments.map((c) => ({
          id: c.id,
          taskUuid: c.task_uuid || taskUuid,
          authorName: c.author_name || "Sanctuary Member",
          avatarUrl: c.avatar_url || null,
          authorProfileUuid: c.author_profile_uuid,
          content: c.content,
          createdAt: c.created_at,
        }));
      }
      if (typeof likes_count === "number") {
        state.likesCountByTask[taskUuid] = likes_count;
      }
      if (typeof shares_count === "number") {
        state.sharesCountByTask[taskUuid] = shares_count;
      }

      saveToLocalStorage(state);
    },

    addComment: (
      state,
      action: PayloadAction<{
        taskUuid: string;
        content: string;
        authorName?: string;
        avatarUrl?: string | null;
        authorProfileUuid?: string;
        id?: number;
        createdAt?: string;
      }>
    ) => {
      const { taskUuid, content, authorName, avatarUrl, authorProfileUuid, id, createdAt } = action.payload;
      if (!state.commentsByTask[taskUuid]) {
        state.commentsByTask[taskUuid] = [];
      }

      const newComment: CommentItem = {
        id: id || Date.now(), // Numeric fallback for optimistic UI updates
        taskUuid,
        authorName: authorName || "Sanctuary Member",
        avatarUrl: avatarUrl || null,
        authorProfileUuid: authorProfileUuid || "",
        content,
        createdAt: createdAt || new Date().toISOString(),
      };

      state.commentsByTask[taskUuid].unshift(newComment);
      saveToLocalStorage(state);
    },

    deleteComment: (state, action: PayloadAction<{ taskUuid: string; commentId: number }>) => {
      const { taskUuid, commentId } = action.payload;
      if (state.commentsByTask[taskUuid]) {
        state.commentsByTask[taskUuid] = state.commentsByTask[taskUuid].filter(
          (c) => c.id !== commentId
        );
        saveToLocalStorage(state);
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
      
      saveToLocalStorage(state);
    },

    toggleLike: (state, action: PayloadAction<string>) => {
      const taskUuid = action.payload;
      const currentStatus = state.isLikedByTask[taskUuid] || false;
      const currentCount = state.likesCountByTask[taskUuid] || 0;

      state.isLikedByTask[taskUuid] = !currentStatus;
      state.likesCountByTask[taskUuid] = !currentStatus 
        ? currentCount + 1 
        : Math.max(0, currentCount - 1);
      
      saveToLocalStorage(state);
    },
  },
});

export const { 
  setTaskInteractions, 
  addComment, 
  deleteComment, 
  toggleShare, 
  toggleLike 
} = interactionsSlice.actions;

export default interactionsSlice.reducer;