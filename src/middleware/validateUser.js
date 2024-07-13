import { AppError } from "../utils/appError.js";

export const validateUser = (req, res, next) => {
  //get user role from user
  const { userRole } = req.user;

  // Check if the user is authorized to add a company
  if (userRole !== "User") {
    return next(new AppError("Only User can perform this action", 403));
  }

  next();
};
