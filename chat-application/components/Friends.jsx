"use client";
import React, { useState } from "react";
import { ArrowLeft, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { fetchCurrentUser } from "@/features/User";

const FriendsList = () => {
  const [search, setSearch] = useState("");
  const { user } = useSelector((store) => store.user);
  const queryClient = useQueryClient();
  const [friendNumber, setFriendNumber] = useState("");
  const dispatch = useDispatch();
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends", user?.userId],
    queryFn: async () => {
      if (!user?.friendsList?.length) return [];
      const results = await Promise.all(
        user.friendsList.map(async (id) => {
          const { data: res } = await axios.get(`/api/v1/user/${id}`);
          return res.data;
        })
      );
      return results;
    },
    enabled: !!user?.userId,
  });
  const { mutate: addFriend, isLoading: adding } = useMutation({
    mutationFn: async (number) => {
      if (number.length > 4 && number[4] !== " ") {
        number = number.slice(0, 4) + " " + number.slice(4);
      }
      const { data: res } = await axios.post(
        "http://localhost:4000/api/v1/user/add/friend",
        {
          phone: number,
        },
        {
          withCredentials: true,
        }
      );

      return res.data;
    },
    onSuccess: async (newFriend) => {
      await dispatch(fetchCurrentUser()).unwrap();
    },
  });
  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center mb-4">
        <Link href={"/home"}>
          <ArrowLeft className="cursor-pointer" />
        </Link>
        <h2 className="text-lg font-bold text-center flex-1">Friends List</h2>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search friends"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 border rounded-lg p-2"
        />
      </div>

      {/* Friends list */}
      <div className="flex flex-col gap-2 overflow-auto flex-1">
        {isLoading ? (
          <p className="text-gray-400 text-center mt-4">Loading friends...</p>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <Link
              key={friend._id}
              className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
              href={{
                pathname: `/chat/${friend._id}`,
                query: { name: friend.name, fromHome: true },
              }}
            >
              {friend.name}
            </Link>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-4">No friends found</p>
        )}
      </div>

      {/* ✅ Add Friend Input & Button */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter friend's number e.g 0312 8090233"
          value={friendNumber}
          onChange={(e) => setFriendNumber(e.target.value)}
          className="flex-1 border rounded-lg p-2"
        />
        <button
          disabled={!friendNumber || adding}
          onClick={() => addFriend(friendNumber)}
          className="bg-blue-500 text-white p-3 rounded-lg shadow disabled:opacity-50"
        >
          <UserPlus size={20} />
        </button>
      </div>
    </div>
  );
};

export default FriendsList;
