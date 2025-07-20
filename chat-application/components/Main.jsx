"use client";
import React, { useState } from "react";
import Welcome from "./Welome";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Home from "@/components/Home";
import FriendsList from "@/components/Friends";
import Chat from "@/components/Chat";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Main = () => {
  const [section, setSection] = useState("welcome"); // welcome, login, signup, home, friends, chat
  const [friends, setFriends] = useState([{ id: 1, name: "John Doe" }]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chat, setChat] = useState({
    server: [
      { from: "friend", text: "Hello there!" },
      { from: "me", text: "Hey, how are you?" },
    ],
  });
  const [user, setUser] = useState(null);
  const { data, error, isLoading, isFetched } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: response } = await axios.get("/api/v1/user/current");
      if (!response) {
        throw new Error("Network response was not ok");
      }
      setUser(response.data);
      setSection("home");
      return response.data;
    },
  });
  return (
    <div className="min-h-screen grid place-content-center w-full bg-gray-100">
      <div className="min-h-[500px] rounded-2xl shadow bg-white w-4/5 md:w-[450px] p-4 relative">
        {section === "welcome" && !user && isFetched && (
          <Welcome setSection={setSection} setChat={setChat} />
        )}
        {section === "login" && (
          <Login setSection={setSection} setUser={setUser} />
        )}
        {section === "signup" && (
          <Signup setSection={setSection} setUser={setUser} />
        )}
        {section === "home" && user && isFetched && (
          <Home
            user={user}
            setSection={setSection}
            setSelectedFriend={setSelectedFriend}
            setChat={setChat}
          />
        )}
        {section === "friends" && (
          <FriendsList
            friends={friends}
            setFriends={setFriends}
            setSection={setSection}
            setSelectedFriend={setSelectedFriend}
          />
        )}
        {section === "chat" && (
          <Chat selectedFriend={selectedFriend} setSection={setSection} />
        )}
      </div>
    </div>
  );
};

export default Main;
