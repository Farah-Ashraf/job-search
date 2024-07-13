import { AppError } from "./appError.js";
//async handler function
export function asyncHandler(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(new AppError(err.message, err.statusCode));
    });
  };
}

//global error handling
export const globalErrorHandling = (err, req, res, next) => {
  console.log("Error:", err);
  return res
    .status(err.statusCode || 500)
    .json({ message: req.errorArr || err.message, success: false }); // stack to know where is the error in the code in details
};
