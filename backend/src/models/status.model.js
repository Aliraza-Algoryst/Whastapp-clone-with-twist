import mongoose from "mongoose";

const statusSchema = new mongoose.Schema(
  {
    viewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    statusmassage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Status = mongoose.model("Status", statusSchema);
