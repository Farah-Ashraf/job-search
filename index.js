//import modules
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/connection.js";
import { globalErrorHandling } from "./src/utils/asyncHandler.js";
import authRouter from "./src/modules/auth/auth.router.js";
import { User } from "./db/models/user.model.js";
import userRouter from "./src/modules/user/user.router.js";
import companyRouter from "./src/modules/company/company.router.js";
import jobRouter from "./src/modules/job/job.router.js";

//create server
const app = express();
const port = 3000;

//connect to db
connectDB();

//parssing
app.use(express.json());

//routings
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);

app.get("/verify/:token", async (req, res, next) => {
  const { token } = req.params;
  const payload = jwt.verify(token, "verify_email");
  await User.findOneAndUpdate({ email: payload.email });
  return res.json({
    message: "your email verified, go to login",
    success: true,
  });
});

app.use(globalErrorHandling);

//listen to port
app.listen(port, () => {
  console.log("server is running on port ", port);
});
