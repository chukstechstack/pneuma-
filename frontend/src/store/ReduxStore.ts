import { configureStore } from "@reduxjs/toolkit";
import interactionsReducer from "../hooks/interactionsSlice";
import followsReducer from "../hooks/followsSlice";

export const store = configureStore({
  reducer: {
    interactions: interactionsReducer,
    follows: followsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

