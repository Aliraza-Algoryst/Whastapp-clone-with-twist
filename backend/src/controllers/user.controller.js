import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  let { password, fullname, email } = req.body;
  try {
    if (!password || !fullname || !email)
      return res.status(400).json({ massage: "All fields are required" });

    let hashpassword = await bcrypt.hash(password, 10);
    console.log(hashpassword);

    let checkuser = await User.findOne({ email: email });
    if (checkuser)
      return res
        .status(400)
        .json({ massage: "User with this email already Exist" });
    const user = new User({
      email,
      password: hashpassword,
      fullname,
    });
    await user.save();
    const savedUser = await User.findById(user._id).select("-password");

    return res
      .status(200)
      .json({ massage: "User Registered Succesfully", user: savedUser });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  let { password, email } = req.body;
  try {
    if (!password || !email)
      return res.status(400).json({ massage: "All fields are required" });

    let findUser = await User.findOne({ email: email });

    if (!findUser)
      return res.status(400).json({ massage: "No user found with this Email" });
    let decryptPassword = await bcrypt.compare(password, findUser?.password);

    if (!decryptPassword)
      return res.status(400).json({ massage: "Password is incorrect" });

    res.status(200).json({ massage: "User Login Succesfully", user: findUser });
  } catch (error) {
    console.log(error);
  }
};

const getSingleUser = async (req, res) => {
  let { email } = req.body;
  try {
    if (!email) return res.status(400).json({ massage: "email is required" });

    let findUser = await User.findOne({ email: email }).select("-password");

    if (!findUser)
      return res.status(400).json({ massage: "No user found with this email" });

    return res
      .status(200)
      .json({ massage: "Single User get Successfully", user: findUser });
  } catch (error) {
    console.log(error);
  }
};
const updateUser = async (req, res) => {
  let { fullname, bio, email } = req.body;
  try {
    if (!fullname || !bio || !email)
      return res.status(400).json({ massage: "All field are required" });

    let findUser = await User.findOneAndUpdate(
      { email: email },
      { fullname: fullname, bio: bio }
    ).select("-password");

    if (!findUser)
      return res.status(400).json({ massage: "No user found with this email" });

    return res
      .status(200)
      .json({ massage: "Profile Updated Succesfully", user: findUser });
  } catch (error) {
    console.log(error);
  }
};
const getalluser = async (req, res) => {
  const query = {};

  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No user found" });
    }

    return res.status(200).json({
      message: "User(s) retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { registerUser, login, getSingleUser, updateUser, getalluser };
