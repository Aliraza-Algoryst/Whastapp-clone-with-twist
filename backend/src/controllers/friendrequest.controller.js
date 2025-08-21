import { User } from "../models/user.model.js";
import { FriendRequest } from "../models/friendrequest.model.js";
import { Room } from "../models/room.model.js";
const sendRequest = async (req, res) => {
  try {
    let { senderId, receiverId } = req.body;
    if (!senderId || !receiverId)
      return res.status(400).json({ massage: "Both Ids are required" });
    const checkUsers = await User.find({
      _id: { $in: [senderId, receiverId] },
    });

    console.log(checkUsers);
    if (checkUsers?.length !== 2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    let checkroom = await Room.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (checkroom) {
      return res.status(400).json({ massage: "Already Friend " });
    }
    let checkRequest = await FriendRequest.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (checkRequest) {
      return res.status(400).json({ massage: "Request already Send " });
    }
    let request = await FriendRequest.create({
      senderId,
      receiverId,
    });

    request = await request.populate("senderId");

    return res
      .status(200)
      .json({ massage: "Friend Request send Succesfully", request });
  } catch (error) {
    console.log(error);
  }
};

const getallrequest = async (req, res) => {
  try {
    let { receiverId } = req.body;
    if (!receiverId)
      return res.status(400).json({ massage: "receiverId is required" });

    const user = await User.find({
      _id: receiverId,
    });
    if (!user) {
      return res.status(400).json({ massage: "No user Found with this id" });
    }
    const checkUsers = await FriendRequest.find({
      receiverId: receiverId,
    }).populate("senderId");

    if (checkUsers.length === 0) {
      return res
        .status(200)
        .json({ message: "No request Found", requests: checkUsers });
    }

    return res.status(200).json({
      message: "Request Get succesfully",
      requests: checkUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

const acceptRequest = async (req, res) => {
  try {
    let { senderId, receiverId, requestId, isAccepted } = req.body;
    if (!senderId || !receiverId)
      return res.status(400).json({ massage: "Ids are required" });

    const checkUsers = await User.find({
      _id: { $in: [senderId, receiverId] },
    });

    if (checkUsers.length !== 2) {
      return res.status(404).json({ message: "One or both users not found" });
    }
    const request = await FriendRequest.findOne({ _id: requestId });
    if (!request) {
      return res.status(400).json({ massage: "No reqeust fround" });
    }

    if (!isAccepted) {
      const request = await FriendRequest.findByIdAndDelete({ _id: requestId });
      return res
        .status(200)
        .json({ massage: "Request Rejected SuccessFully", request });
    }
    const deleterequest = await FriendRequest.findByIdAndDelete({
      _id: requestId,
    });

    const check = await Room.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    if (check) {
      return res.status(400).json({ massage: "Room Already Created" });
    }
    const room = await Room.create({
      senderId,
      receiverId,
    });

    return res.status(200).json({
      message: "Request Accepted succesfully",
      requests: checkUsers,
      requestCount: checkUsers.length,
      room: "Room Also created",
    });
  } catch (error) {
    console.log(error);
  }
};

export { sendRequest, getallrequest, acceptRequest };
