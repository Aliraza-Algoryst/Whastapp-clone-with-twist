import mongoose from "mongoose";

const massageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    massage: {
      type: String,
      required: true,
    },
    massagetype: {
      type: String,
    },

    massagestate: {
      type: String,
      enum: ["send", "delivered", "seen"],
    },
    reaction: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Massage = mongoose.model("Massage", massageSchema);
