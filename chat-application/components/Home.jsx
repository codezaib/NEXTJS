import React, { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SubChat from "./SubChat";

const Home = ({ user, setSection, setSelectedFriend, chat, setChat }) => {
  const [search, setSearch] = useState("");
  const {
    data: friends,
    error,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["friend"],
    queryFn: async () => {
      if (!user?.friendsList?.length) return [];
      const friends = await Promise.all(
        user.friendsList.map(async (f) => {
          const { data: response } = await axios.get(`/api/v1/user/${f}`);
          if (!response) {
            throw new Error("Network response was not ok");
          }
          return response.data;
        })
      );
      return friends;
    },
    enabled: !!user?.friendsList,
  });
  const filteredFriends = friends?.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-center">Chats</h2>

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

      <div className="flex flex-col gap-2 flex-1 overflow-auto">
        {filteredFriends?.length > 0 ? (
          filteredFriends.map((friend) => (
            <SubChat
              key={friend._id}
              friend={friend}
              setSelectedFriend={setSelectedFriend}
              setSection={setSection}
              chat={chat}
              setChat={setChat}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center mt-4">No chats found</p>
        )}
      </div>

      <button
        onClick={() => setSection("friends")}
        className="w-full mt-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Add Friends
      </button>
    </div>
  );
};

export default Home;
