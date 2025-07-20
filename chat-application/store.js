import { configureStore } from "@reduxjs/toolkit";
import chatsReducer from "./features/Chats.js";

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
  },
});
