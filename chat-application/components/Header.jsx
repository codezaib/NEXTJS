import { MessageCircleMore } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="flex items-center justify-between bg-gray-800 text-white p-4">
      <div className="flex gap-2 mx-auto items-center text-3xl ">
        <MessageCircleMore />
        <h2>Chat.IO</h2>
      </div>
    </div>
  );
};

export default Header;
