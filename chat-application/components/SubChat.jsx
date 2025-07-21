"use client";
import { fetchFriendChats, setChat, updateChat } from "@/features/Chats";
import { parse } from "dotenv";
import { ArrowDownLeft, ArrowUp, ArrowUpRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

function stringToColor(str) {
  // Generate a consistent hash-based color from the name
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`; // pastel-like random color
  return color;
}

const SubChat = ({ friend, user }) => {
  const { chats } = useSelector((state) => state.chats);
  console.log(user);
  return (
    <div
      key={friend._id}
      className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
    >
      {/* Avatar Placeholder */}
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-lg"
        style={{
          backgroundColor: stringToColor(friend.name), // random consistent color
        }}
      >
        {friend.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-800">
          {user?.friendsList.includes(friend._id) ? friend.name : friend.phone}
        </span>
        {chats?.[friend._id]?.length > 0 && (
          <p className="text-sm text-gray-400 flex gap-0.5 items-center">
            {chats[friend._id] &&
              chats[friend._id].length > 0 &&
              (chats[friend._id][chats[friend._id].length - 1].from === "me" ? (
                <ArrowUpRight className="text-blue-500" /> // you sent the last message
              ) : (
                <ArrowDownLeft className="text-green-500" /> // friend sent the last message
              ))}
            {chats[friend._id][chats[friend._id].length - 1].text}
          </p>
        )}
      </div>
    </div>
  );
};

export default SubChat;
