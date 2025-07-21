import React, { useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

let socket; // ✅ global per component

const Chat = () => {
  const { register, handleSubmit, reset } = useForm();
  const { chats } = useSelector((state) => state.chats);
  const { id } = useParams();
  const [messages, setMessages] = useState(chats[id] || []);
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const fromHome = searchParams.get("fromHome");
  useEffect(() => {
    if (!id) return;

    socket = io(`ws://localhost:4000/chat`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket for:", name);
    });

    socket.on("receiveMessage", (message) => {
      socket.on("receiveMessage", (message) => {
        if (String(message.senderId) !== String(id)) return;
        setMessages((prev) => [
          ...prev,
          {
            text: message.content,
            from: "friend",
          },
        ]);
      });
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect(); // ✅ clean up when leaving chat
    };
  }, [id]);

  const handleSend = (data) => {
    if (!data.message.trim()) return;

    socket.emit("sendMessage", {
      receiverId: id,
      content: data.message,
    });

    setMessages((prev) => [...prev, { text: data.message, from: "me" }]);
    reset();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-2">
        <Link href={fromHome ? "/home" : "/"}>
          <ArrowLeft className="cursor-pointer" />
        </Link>
        <h2 className="text-lg font-bold text-center flex-1">{name}</h2>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] w-fit break-words p-2 rounded-lg ${
              msg.from === "me"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(handleSend)}
        className="flex items-center mt-2"
      >
        <input
          {...register("message", { required: "Message is required" })}
          type="text"
          placeholder="Type a message..."
          className="border rounded-lg p-2 flex-1 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
