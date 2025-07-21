import { useDispatch } from "react-redux";
import { setChat } from "./Chats";
import { io } from "socket.io-client";
import axios from "axios";

export const useFetchMessages = () => {
  const dispatch = useDispatch();

  const fetchMessages = async (friends) => {
    friends.forEach((friend) => {
      const socket = io("ws://localhost:4000/messages", {
        transports: ["websocket"],
        query: { receiveId: friend._id },
      });

      socket.on("connect", () => {
        console.log("Connected to socket server for friend:", friend.name);
      });

      socket.on("displayMessages", (messages) => {
        console.log("Received message:", messages);
        const parsedMessages = messages.map((msg) => ({
          text: msg.content,
          from: String(msg.senderId) === String(friend._id) ? "friend" : "me",
        }));
        dispatch(
          setChat({
            friendId: friend._id,
            messages: parsedMessages,
          })
        );
        socket.disconnect();
      });
    });
  };

  return fetchMessages;
};

export const fetchNotFriends = async (user) => {
  return new Promise((resolve, reject) => {
    const socket = io("ws://localhost:4000/messages", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected for messages");
    });

    socket.on("displayMessages", async (messages) => {
      try {
        console.log("Raw messages from socket:", messages);
        console.log("User ID:", user.userId, "Friends:", user.friendsList);

        const notFriendsMessages = messages.filter(
          (msg) =>
            !user.friendsList.map(String).includes(String(msg.senderId)) &&
            (String(msg.receiverId) === String(user.userId) ||
              String(msg.senderId) === String(user.userId))
        );

        console.log("Not friends messages:", notFriendsMessages);

        const uniqueSenderIds = [
          ...new Set(notFriendsMessages.map((msg) => msg.senderId)),
        ];

        const notFriends =
          uniqueSenderIds.length > 0
            ? await Promise.all(
                uniqueSenderIds.map(async (f) => {
                  const { data: response } = await axios.get(
                    `/api/v1/user/${f}`
                  );
                  if (!response) {
                    throw new Error("Network response was not ok");
                  }
                  return response.data;
                })
              )
            : [];

        socket.disconnect();
        resolve(notFriends);
      } catch (error) {
        socket.disconnect();
        reject(error);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      socket.disconnect();
      reject(err);
    });
  });
};
