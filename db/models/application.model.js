//import modules
import { model, Schema } from "mongoose";

//schema
const applicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userTechSkills: { type: [String], required: true },
    userSoftSkills: { type: [String], required: true },
    userResume: { type: String, required: true }, // URL of the uploaded PDF on Cloudinary
  },
  { timestamps: true }
);

//model
export const Application = model("Application", applicationSchema);
