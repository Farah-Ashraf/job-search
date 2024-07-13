import mongoose from "mongoose";
import { Job } from "./../../../db/models/job.model.js";
import { Company } from "./../../../db/models/company.model.js";
import { Application } from "./../../../db/models/application.model.js";
import { AppError } from "./../../utils/appError.js";
import configCloudinary from "../../../config/cloudinary.js";

// create job
export const addJob = async (req, res, next) => {
  //get data of the user
  const { userId } = req.user;

  //create the new job
  const newJob = new Job({ ...req.body, addedBy: userId });

  const createdJob = await newJob.save();

  //return response
  return res.status(200).json({
    message: "Job created successfully",
    success: true,
    data: createdJob,
  });
};

//update job
export const updateJob = async (req, res, next) => {
  //get data of the user
  const { userId } = req.user;
  const { id } = req.params;

  //get job info

  //check for job existence
  const job = await Job.findOne({ _id: id, addedBy: userId });
  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    message: "Job data updated successfully",
    success: true,
    data: updatedJob,
  });
};

//delete job
export const deleteJob = async (req, res, next) => {
  //get data of the user
  const { userId } = req.user;
  const { id } = req.params;

  //check for job existence
  const job = await Job.findOne({ _id: id, addedBy: userId });
  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  await Job.findByIdAndDelete(id);

  res.status(200).json({
    message: "Job data deleted successfully",
    success: true,
  });
};

//Get all Jobs with their company’s information.
export const getJobsWithCompanyInformation = async (req, res, next) => {
  // Fetch all jobs with company information
  const jobs = await Job.find();
  const jobsWithCompany = [];
  for (let i = 0; i < jobs.length; i++) {
    // Get the company of thie HR who added this job
    const company = await Company.findOne({ companyHR: jobs[i].addedBy });
    jobsWithCompany.push({ ...jobs[i]._doc, company });
  }

  res.status(200).json({
    message: "Jobs fetched successfully",
    success: true,
    data: jobsWithCompany,
  });
};

//Get all Jobs of certain company.
export const getCompanyJobs = async (req, res, next) => {
  // Fetch all jobs with company information
  const { companyId } = req.params;
  // get the hr of this company
  const company = await Company.findById(companyId).select("companyHR");
  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  const jobs = await Job.find({ addedBy: company.companyHR });

  res.status(200).json({
    message: "Jobs fetched successfully",
    success: true,
    data: jobs,
  });
};

// Filter jobs
export const filterJobs = async (req, res, next) => {
  // Get filters from query params
  const filters = {};
  Object.entries(req.query).forEach(([key, value]) => {
    if (value) {
      filters[key] = value;
    }
  });

  const jobs = await Job.find(filters);

  res.status(200).json({
    message: "Jobs fetched successfully",
    success: true,
    data: jobs,
  });
};

// Apply to job
export const applyToJob = async (req, res, next) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;

  if (!req.file) {
    return next(new AppError("userResume file is required", 400));
  }

  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

  const uploadResult = await configCloudinary().uploader.upload(dataURI, {
    resource_type: "auto",
  });

  const uploadedUrl = uploadResult.secure_url;

  const application = await Application.create({
    ...req.body,
    jobId: new mongoose.Types.ObjectId(jobId),
    userId: new mongoose.Types.ObjectId(userId),
    userResume: uploadedUrl,
  });

  res.status(200).json({
    message: "Applied to job successfully",
    success: true,
    data: application,
  });
};
