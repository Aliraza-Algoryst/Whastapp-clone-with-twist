import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { userRouter } from "../routes/user.route.js";
import { requestRouter } from "../routes/friendrequest.route.js";
import { massageRouter } from "../routes/massage.route.js";
import {
  getallroom,
  getMessages,
  sendMessage,
} from "../controllers/massage.controller.js";
import { Room } from "../models/room.model.js";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ["https://chatapp-byali.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRouter);
app.use("/api/v1", requestRouter);
app.use("/api/v1", massageRouter);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const userSocketMap = {};
const io = new Server(server, {
  cors: {
    origin: ["https://chatapp-byali.netlify.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connect", (socket) => {
  console.log("A user connected:", socket.id);
  const userId = socket.handshake.auth.userId;

  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.userId = userId;
  console.log(userSocketMap);

  socket.on("get_all_massages", async (credentials) => {
    const result = await getMessages(credentials);

    if (result.error) {
      socket.emit("all_messages_error", result.error);
    } else {
      socket.emit("all_messages", result.data);
    }
  });
  socket.on("send_massage", async (credentials) => {
    const result = await sendMessage(credentials);

    if (result.error) {
      socket.emit("send_massage_error", result.error);
    } else {
      socket.emit("receive_massage", result.data);
    }
  });
  socket.on("start_typing", async (credentials) => {
    if (credentials.check) {
      io.emit("is_typing", credentials);
    } else {
      io.emit("is_typing", credentials);
    }
  });

  socket.on("unread_massage", async (roomdata) => {
    try {
      const room = await Room.findOne({ _id: roomdata._id });
      if (!room) {
        console.log("No room found for unread reset");
        return;
      }
      console.log(
        "Resetting unread for room:",
        roomdata._id,
        "isUserSender:",
        roomdata.isUserSender
      );

      if (roomdata.isUserSender) {
        room.senderUnread = 0;
        console.log("Reset senderUnread to 0");
      } else {
        room.receiverUnread = 0;
        console.log("Reset receiverUnread to 0");
      }
      await room.save();
      console.log("Unread reset successful for room:", roomdata._id);
    } catch (error) {
      console.error("Error resetting unread:", error);
    }
  });
  // });
  socket.on("request_rooms", async (credentials) => {
    console.log("in on request_rooms", credentials);

    try {
      const userId = credentials;
      if (!userId) {
        return socket.emit("get_rooms", {
          message: "User ID is required",
          room: [],
        });
      }

      let room = await Room.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
        .populate("senderId")
        .populate("receiverId");

      if (room.length === 0) {
        return socket.emit("get_rooms", { message: "No rooms found", room });
      }

      // Send rooms back to this specific client
      socket.emit("get_rooms", {
        message: "Rooms retrieved successfully",
        room,
      });
    } catch (error) {
      console.error("Error in getallroom:", error);
      socket.emit("get_rooms", { message: "Server error", room: [] });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user Disconnected:", socket.id);
    if (socket.userId) {
      delete userSocketMap[socket.userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
