import React from "react";
import { links } from "@/utils/links";
import Link from "next/link";
const Header = () => {
  return (
    <div className="bg-amber-300 h-5 flex justify-evenly">
      {links.map((link) => {
        return (
          <Link href={link.link} key={link.label}>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};

export default Header;
