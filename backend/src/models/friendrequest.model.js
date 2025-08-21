// friendrequest.model.js
import mongoose from "mongoose";

const friendrequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const FriendRequest = mongoose.model("FriendRequest", friendrequestSchema);
