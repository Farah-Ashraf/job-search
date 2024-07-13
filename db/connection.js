//import modules
import mongoose from "mongoose";

//create connection
export const connectDB = () => {
  mongoose.connect(process.env.DATABASE_URI).then(() => {
    console.log("db connected successfully");
  });
};
