import { AppError } from "../utils/appError.js";

export const validateHR = (req, res, next) => {
  //get user role from user
  const { userRole } = req.user;

  // Check if the user is authorized to add a company
  if (userRole !== "company_HR") {
    return next(new AppError("Only Company_HR can perform this action", 403));
  }

  next();
};
