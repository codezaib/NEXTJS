"use client";
import { fetchCurrentUser } from "@/features/User";
import { MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((store) => store.user);
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && user?.userId) {
      router.replace("/home");
    }
  }, [user, loading]);
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
