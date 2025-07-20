import React from "react";

const Welcome = ({ setSection, setChat }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Welcome to ChatApp</h1>
      <p className="text-gray-500 mb-6 text-center">
        Start chatting with friends or try a demo chat with the server.
      </p>
      <button
        onClick={() => setSection("login")}
        className="w-full py-2 mb-3 bg-blue-500 text-white rounded-lg"
      >
        Login
      </button>
      <button
        onClick={() => setSection("signup")}
        className="w-full py-2 mb-10 bg-green-500 text-white rounded-lg"
      >
        Sign Up
      </button>
      <button
        onClick={() => {
          setSection("chat");
        }}
        className="absolute bottom-4 right-4 text-sm text-blue-600 underline"
      >
        Demo Chat
      </button>
    </div>
  );
};

export default Welcome;
