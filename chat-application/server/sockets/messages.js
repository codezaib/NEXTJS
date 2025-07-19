import { createClient } from "redis";
import BadRequest from "../errors/badRequest.js";
const redisClient = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});
redisClient.connect();
redisClient.on("error", (err) => console.error("Redis Client Error", err));
export const getUserMessages = async (req, res) => {
  const { id: userId } = req.params;

  if (!userId) throw new BadRequest("User ID is required");
  try {
    // Fetch messages from Redis
    const messages = await redisClient.lRange(`messages:${userId}`, 0, -1);

    // Parse messages from JSON strings to objects
    const parsedMessages = messages.map((msg) => JSON.parse(msg));

    res.status(200).json({
      success: true,
      data: parsedMessages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

export const chat = (chatNsp) => {
  return async (socket) => {
    const userId = socket.user.userId;
    socket.join(userId);
    await redisClient
      .lRange(`messages:${userId}`, 0, -1)
      .then((pendingMessages) => {
        pendingMessages.forEach((msgStr) => {
          const msg = JSON.parse(msgStr);
          socket.emit("receiveMessage", msg);
        });
      })
      .finally(async () => {
        await redisClient.del(`messages:${userId}`);
      });
    socket.on("sendMessage", async (msgData) => {
      const { receiverId } = msgData;

      if (!receiverId) {
        throw new BadRequest("Receiver ID is required");
      }

      const isReceiverOnline = chatNsp.adapter.rooms.has(receiverId);

      if (isReceiverOnline) {
        chatNsp.to(receiverId).emit("receiveMessage", msgData);
      } else {
        await redisClient.rPush(
          `messages:${receiverId}`,
          JSON.stringify(msgData)
        );
      }
    });
  };
};
