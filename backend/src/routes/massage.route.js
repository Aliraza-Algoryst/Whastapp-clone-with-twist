import { Router } from "express";
import { getallroom, getMessages, sendMessage } from "../controllers/massage.controller.js";



const massageRouter = Router();

massageRouter.route("/send_massage").post(sendMessage);
massageRouter.route("/get_all_room").post(getallroom);
massageRouter.route("/get_massages").post(getMessages);


export { massageRouter };
