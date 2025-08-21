import { Massage } from "../models/Massage.model.js";
import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/sockets.js";
export const getallroom = async (credentials) => {
  try {
    let { userId } = credentials; // Rename from receiverId to userId for clarity
    if (!userId) {
      return { message: "User ID is required" };
    }

    let room = await Room.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId")
      .populate("receiverId");

    if (room.length === 0) {
      return { message: "No rooms found", room };
    }

    socket.emit("get_rooms", room);

    return { message: "Rooms retrieved successfully", room };
  } catch (error) {
    console.error("Error in getallroom:", error);
    return { message: "Server error", error };
  }
};

export const sendMessage = async (credentials) => {
  try {
    let {
      senderId,
      receiverId,
      roomId,
      massage,
      massagetype = "text",
      reaction,
    } = credentials;

    if (!senderId || !receiverId || !roomId || !massage || !massagetype) {
      return { error: "Please provide all required fields" };
    }

    const checkUsers = await User.find({
      _id: { $in: [senderId, receiverId] },
    });

    if (checkUsers.length !== 2) {
      return { error: "USers Not found" };
    }

    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return { error: "Room not Found" };
    }

    const createdMessage = await Massage.create({
      senderId,
      receiverId,
      roomId,
      massage,
      massagetype,
      reaction,
    });
    room.lastmassage = massage;
    room.lastmassagetime = createdMessage.createdAt;
    console.log(senderId, "<--senderId", "reciverId-->", receiverId);

    if (room.senderId.toString() === senderId.toString()) {
      room.receiverUnread += 1;
      console.log("In receiver increment");
    } else if (room.receiverId.toString() === senderId.toString()) {
      room.senderUnread += 1;
      console.log("In sender increment");
    }
    room.lastmassageUserid = senderId;

    await room.save();
    console.log(room, "the room currently chatting");
    //socket functionality
    const recieverSocketId = getReceiverSocketId(receiverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMassage", createdMessage);
    }
    return { data: createdMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    return { message: "Server error" };
  }
};
export const getMessages = async (credentials) => {
  try {
    const { senderId, receiverId, roomId } = credentials;

    if (!senderId || !receiverId || !roomId) {
      return { error: "Please provide all required fields" };
    }

    const checkUsers = await User.find({
      _id: { $in: [senderId, receiverId] },
    });

    if (checkUsers.length !== 2) {
      return { error: "User(s) not found" };
    }

    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return { error: "Room not found" };
    }

    const messages = await Massage.find({
      $or: [
        { senderId: receiverId, receiverId: senderId, roomId },
        { senderId: senderId, receiverId: receiverId, roomId },
      ],
    }).sort({ createdAt: 1 });

    if (messages.length === 0) {
      return { message: "No messages found", data: [] };
    }

    return { data: messages };
  } catch (error) {
    console.error("Error getting messages:", error);
    return { error: "Server error" };
  }
};
