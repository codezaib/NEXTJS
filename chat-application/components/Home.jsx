"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SubChat from "./SubChat";
import { fetchNotFriends, useFetchMessages } from "@/features/Socket";
import { useSelector } from "react-redux";
import Link from "next/link";

const Home = () => {
  const { user } = useSelector((store) => store.user);
  const [search, setSearch] = useState("");
  const fetchMessages = useFetchMessages();

  const {
    data: allChats = [],
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["friends", user?._id],
    queryFn: async () => {
      if (!user?.userId) return [];

      // ✅ Fetch Friends
      const friends = await Promise.all(
        user.friendsList.map(async (f) => {
          const { data: response } = await axios.get(`/api/v1/user/${f}`);
          return response.data;
        })
      );

      // ✅ Fetch Not Friends from Socket
      const notFriends = await fetchNotFriends(user);

      // ✅ Combine & Fetch Messages
      const allChats = [...friends, ...notFriends];
      await fetchMessages(allChats);

      return allChats;
    },
    enabled: !!user?.userId, // ✅ run only if user exists
    refetchOnMount: "always", // ✅ refetch when returning to home
    refetchOnWindowFocus: false,
    staleTime: 0, // ✅ always fresh
  });

  const filteredFriends = allChats.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-center">Chats</h2>

      {/* ✅ Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 border rounded-lg p-2"
        />
      </div>

      {/* ✅ Chats List */}
      <div className="flex flex-col gap-2 flex-1 overflow-auto">
        {isLoading ? (
          <div className="w-full h-full grid place-content-center">
            <div className="loader1"></div>
          </div>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <Link
              key={friend._id}
              href={{
                pathname: `/chat/${friend._id}`,
                query: { name: friend.name, fromHome: true },
              }}
              className="block"
            >
              <SubChat friend={friend} user={user} />
            </Link>
          ))
        ) : (
          isFetched && (
            <p className="text-gray-400 text-center mt-4">No chats found</p>
          )
        )}
      </div>

      {/* ✅ Add Friends Button */}
      <Link
        href={"/friends"}
        className="text-center leading-10 rounded text-white text-lg bg-green-600 h-10 mt-4"
      >
        Add Friends
      </Link>
    </div>
  );
};

export default Home;
