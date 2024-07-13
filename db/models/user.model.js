//import modules
import { model, Schema } from "mongoose";

//schema
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    recoveryEmail: { type: String },
    DOB: { type: Date, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: ["User", "company_HR"], required: true },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    passwordResetOTP: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

//model
export const User = model("User", userSchema);
