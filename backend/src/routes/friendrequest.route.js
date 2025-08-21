import { Router } from "express";
import { acceptRequest, getallrequest, sendRequest } from "../controllers/friendrequest.controller.js";


const requestRouter = Router();

requestRouter.route("/send_request").post(sendRequest);
requestRouter.route("/get_all_request").post(getallrequest);
requestRouter.route("/accept_request").post(acceptRequest);


export { requestRouter };
