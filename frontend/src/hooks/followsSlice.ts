import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define what a connection card looks like in memory
export interface ConnectedUser {
  uuid: string;
  full_name: string;
  avatar_url: string | null;
}

interface FollowsState {
  // Dictionary mapping user_uuid -> ConnectedUser object (or null if unfollowed)
  followingStatus: Record<string, ConnectedUser | null>;
}

const loadInitialState = (): Record<string, ConnectedUser | null> => {
  try {
    const saved = localStorage.getItem("pneuma_follows_state");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const initialState: FollowsState = {
  followingStatus: loadInitialState(),
};

export const followsSlice = createSlice({
  name: "follows",
  initialState,
  reducers: {
    // 2. The action payload now takes the WHOLE user data packet!
    toggleFollowStatus: (state, action: PayloadAction<ConnectedUser>) => {
      const user = action.payload;
      const exists = !!state.followingStatus[user.uuid];

      if (exists) {
        // If they exist, remove them (Unconnect)
        delete state.followingStatus[user.uuid];
      } else {
        // If they don't exist, save their whole profile packet!
        state.followingStatus[user.uuid] = user;
      }

      try {
        localStorage.setItem("pneuma_follows_state", JSON.stringify(state.followingStatus));
      } catch (err) {
        console.error("Failed to save follow state", err);
      }
    },
  },
});

export const toggleFollowStatus = followsSlice.actions.toggleFollowStatus;
const followsReducer = followsSlice.reducer;
export default followsReducer;
