import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import express from "express";
import next from "next";
import redis from "redis";
import cors from "cors";
import { connectDB } from "./server/db/connect.js";
import { errorHandler } from "./server/middlewares/errorhandler.js";
import { notFound } from "./server/middlewares/notFound.js";
import cookieParser from "cookie-parser";
import userRouter from "./server/routes/user.js";
import authRouter from "./server/routes/auth.js";
import { Server } from "socket.io";
import { authenticationSocket } from "./server/middlewares/authenticateSocket.js";
import { chat, getMessages } from "./server/sockets/messages.js";
const port = process.env.PORT || 4000;
const dev = process.env.NODE_ENV !== "production";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

app.get("/api/hello", (req, res) => {
  res.send("this is API Response");
});

app.use(notFound);
app.use(errorHandler);
const server = app.listen(port, async () => {
  try {
    await connectDB(process.env.MONGO_API_URL);
    console.log(`server is listening on port: ${port}`);
  } catch (error) {
    console.log(error);
  }
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.of("/demo").on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.emit("welcome", "Welcome to the demo namespace!");
  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.of("/demo").emit("message", data); // Broadcast to all sockets in the namespace
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const chatNsp = io.of("/chat");
const chatSp = io.of("/messages");
chatNsp.use(authenticationSocket);
chatSp.use(authenticationSocket);
chatNsp.on("connection", chat(chatNsp));
chatSp.on("connection", getMessages(chatSp));
//?For production
// const nextApp = next({ dev }); // ✅ no extra options
// const handle = nextApp.getRequestHandler();

// nextApp.prepare().then(() => {
//   const server = express();

//   // Example custom route
//   server.get("/api/hello", (req, res) => {
//     res.json({ msg: "Hello from Express API!" });
//   });

//   // Catch-all route for Next.js
//   server.use((req, res) => {
//     return handle(req, res);
//   });

//   server.listen(port, () => {
//     console.log(`> Ready on http://localhost:${port}`);
//   });
// });
