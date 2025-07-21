import { configureStore } from "@reduxjs/toolkit";
import chatsReducer from "./features/Chats.js";
import userReducer from "./features/User.js";
export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    user: userReducer,
  },
});
