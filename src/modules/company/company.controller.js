//add company
import { Company } from "./../../../db/models/company.model.js";
import { Job } from "./../../../db/models/job.model.js";
import { AppError } from "./../../utils/appError.js";

export const addCompany = async (req, res, next) => {
  //get data of the user
  const { userId } = req.user;

  //get company info
  const {
    companyName,
    description,
    industry,
    address,
    companyEmail,
    numberOfEmployees,
  } = req.body;

  //check for company existence
  const company = await Company.findOne({ companyName, companyEmail });
  if (company) {
    return next(
      new AppError("company already exist with this email or name", 400)
    );
  }

  //create the new company
  const newCompany = new Company({
    companyName,
    description,
    industry,
    address,
    companyEmail,
    numberOfEmployees,
    companyHR: userId,
  });

  const createdCompany = await newCompany.save();

  //return response
  return res.status(200).json({
    message: "company created successfully",
    success: true,
    data: createdCompany,
  });
};

//update company
export const updateCompany = async (req, res, next) => {
  //get data of the user
  const { userId } = req.user;
  const { id } = req.params;

  //get company info
  const {
    companyName,
    description,
    industry,
    address,
    companyEmail,
    numberOfEmployees,
  } = req.body;

  //check for company existence
  const company = await Company.findOne({ _id: id, companyHR: userId });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    id,
    {
      companyName,
      description,
      industry,
      address,
      companyEmail,
      numberOfEmployees,
    },
    { new: true }
  );

  res.status(200).json({
    message: "Company data updated successfully",
    success: true,
    data: updatedCompany,
  });
};

//delete company
export const deleteCompany = async (req, res, next) => {
  //get data of the user
  const { userId } = req.user;
  const { id } = req.params;

  //check for company existence
  const company = await Company.findOne({ _id: id, companyHR: userId });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  await Company.findByIdAndDelete(id);

  res.status(200).json({
    message: "Company data deleted successfully",
    success: true,
  });
};

//get company
export const getCompany = async (req, res, next) => {
  //get data of the user
  const { userId } = req.user;
  const { id } = req.params;

  //check for company existence
  const company = await Company.findOne({ _id: id, companyHR: userId });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  // Get related jobs
  const jobs = await Job.find({ addedBy: company.companyHR });
  res.status(200).json({
    message: "Company data returned successfully",
    success: true,
    data: { ...company._doc, jobs },
  });
};

//get company by name
export const getCompanyByName = async (req, res, next) => {
  //get data of the user
  const { companyName } = req.query;

  //check for company existence
  const company = await Company.findOne({ companyName });
  if (!company) {
    return next(new AppError("No Company with such name", 404));
  }

  res.status(200).json({
    message: "Company data returned successfully",
    success: true,
    data: company,
  });
};
