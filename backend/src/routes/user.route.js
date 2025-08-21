import { Router } from "express";
import {
  getalluser,
  getSingleUser,
  login,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(login);
userRouter.route("/get_single_user").post(getSingleUser);
userRouter.route("/update_profile").post(updateUser);
userRouter.route("/get_all_user").post(getalluser);

export { userRouter };
