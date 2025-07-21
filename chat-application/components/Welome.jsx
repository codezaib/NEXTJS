"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Welcome to ChatApp</h1>
      <p className="text-gray-500 mb-6 text-center">
        Start chatting with friends or try a demo chat with the server.
      </p>
      <Link
        href={"/login"}
        className="w-full py-2 mb-3 bg-blue-500 text-white rounded-lg text-center"
      >
        Login
      </Link>
      <Link
        href={"/signup"}
        className="w-full py-2 mb-10 bg-green-500 text-white rounded-lg text-center"
      >
        Sign Up
      </Link>
      <Link
        href={"/chat/1234"}
        className="absolute bottom-4 right-4 text-sm text-blue-600 underline"
      >
        Demo Chat
      </Link>
    </div>
  );
};

export default Welcome;
