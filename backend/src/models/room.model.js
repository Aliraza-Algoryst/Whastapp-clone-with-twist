import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    senderUnread: {
      type: Number,
      default: 0,
    },
    receiverUnread: {
      type: Number,
      default: 0,
    },
    lastmassagetime: {
      type: String,
    },
    lastmassage: {
      type: String,
    },
    lastmassageUserid: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
