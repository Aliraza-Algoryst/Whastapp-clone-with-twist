import { connectDb } from "./src/db/db.js";
import { io, app, server } from "./src/socket/sockets.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

connectDb().then(() => {
  try {
    server.listen(process.env.PORT, () => {
      console.log(`Express is working Perfect ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
});
