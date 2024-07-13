//import modules
import { model, Schema } from "mongoose";

//schema
const companySchema = new Schema(
  {
    companyName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: { type: String, required: true },
    companyEmail: { type: String, required: true, unique: true },
    companyHR: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

//model
export const Company = model("Company", companySchema);
