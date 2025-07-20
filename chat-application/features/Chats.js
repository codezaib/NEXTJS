import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    chats: {},
  },
  reducers: {
    addChat: (state, action) => {
      const { friendId, messages } = action.payload;
      state.chats[friendId] = [...(state.chats[friendId] || []), ...messages];
    },
    setChat: (state, action) => {
      const { friendId, messages } = action.payload;
      state.chats[friendId] = messages;
    },
    updateChat: (state, action) => {
      const { friendId, message } = action.payload;
      if (state.chats[friendId]) {
        state.chats[friendId].push(message);
      } else {
        state.chats[friendId] = [message];
      }
    },
  },
});
export const { addChat, updateChat, setChat } = chatsSlice.actions;
export default chatsSlice.reducer;
