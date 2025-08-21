import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
const connectDb = async () => {
  try {
    const database = await mongoose.connect(`${process.env.MONGO_DB_URL}`);
    console.log("Db is connected" + database.connection.host);
  } catch (error) {
    console.log(error);
  }
};

export { connectDb };
