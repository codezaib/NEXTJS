import React from "react";

const Footer = () => {
  return (
    <div className="bg-gray-800 text-center p-4 text-white text-lg">
      ©{new Date().getFullYear()} chat.io rights reserved
    </div>
  );
};

export default Footer;
