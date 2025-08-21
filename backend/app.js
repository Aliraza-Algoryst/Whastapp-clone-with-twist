import express from "express";
import { userRouter } from "./src/routes/user.route.js";
import { requestRouter } from "./src/routes/friendrequest.route.js";
import { massageRouter } from "./src/routes/massage.route.js";
import { app } from "./src/socket/sockets.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRouter);
app.use("/api/v1", requestRouter);
app.use("/api/v1", massageRouter);
