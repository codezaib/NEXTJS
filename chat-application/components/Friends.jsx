import React, { useState } from "react";
import { ArrowLeft, Search, UserPlus } from "lucide-react";

const FriendsList = ({
  friends,
  setFriends,
  setSection,
  setSelectedFriend,
}) => {
  const [search, setSearch] = useState("");

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center mb-4">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => setSection("home")}
        />
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
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSelectedFriend(friend);
                setSection("chat");
              }}
            >
              {friend.name}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-4">No friends found</p>
        )}
      </div>

      {/* Add Friend button */}
      <button
        className="absolute bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow"
        onClick={() =>
          setFriends([
            ...friends,
            { id: Date.now(), name: `Friend ${friends.length + 1}` },
          ])
        }
      >
        <UserPlus size={20} />
      </button>
    </div>
  );
};

export default FriendsList;
