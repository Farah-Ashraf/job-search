import { User } from "../../../db/models/user.model.js";
import { AppError } from "./../../utils/appError.js";
import bcrypt from "bcrypt";

//update user info
export const updateUser = async (req, res, next) => {
  //get data to be updated
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
    req.body;
  const { userId } = req.user;

  // Check if email or mobile number already exists
  if (email || mobileNumber) {
    const user = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    if (user && user._id.toString() !== userId) {
      return next(new AppError("Email or mobile number already exists", 400));
    }
  }

  //update user info
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { email, mobileNumber, recoveryEmail, DOB, lastName, firstName },
    { new: true }
  );

  // Remove the password from the response
  delete updatePassword.password;

  //response
  return res.status(200).json({
    message: "user account updated successfully",
    success: true,
    data: updatedUser,
  });
};

//delete user account
export const deleteUserAccount = async (req, res, next) => {
  const { userId } = req.user;

  //delete user with his id
  const deletedAccount = await User.deleteOne({ _id: userId }); // deleteOne return true or false

  // Check if user was found and deleted
  if (!deletedAccount.deletedCount) {
    return next(new AppError("User not found", 404));
  }

  //return success response
  return res
    .status(200)
    .json({ message: "user account deleted successfully", success: true });
};

//get user account data
export const getUserAccountData = async (req, res, next) => {
  const { userId } = req.user;

  //get user data
  const user = await User.findById(userId).select("-password");

  // Check if user exists
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(200).json({
    message: "user data returned successfully",
    success: true,
    data: user,
  });
};

//Get profile data for another user
export const getAnotherUserAccountData = async (req, res, next) => {
  //get the id of the user and the id of the searched user
  const { searchUserId } = req.params;

  //find searched user
  const searchedUser = await User.findById(searchUserId);

  //check for searched user existence
  if (!searchedUser) {
    return next(new AppError("User not found", 404));
  }

  // Remove password from the response
  searchedUser.password = undefined;

  //return response
  return res.status(200).json({
    message: "user data returned successfully",
    success: true,
    data: searchedUser,
  });
};

//Update password
export const updatePassword = async (req, res, next) => {
  const { userId } = req.user;
  const { newPassword } = req.body;

  // get user data
  const user = await User.findById(userId);

  // Check if user exists
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(newPassword, 8);

  // Update user password
  user.password = hashedPassword;
  await user.save();

  //return response
  return res
    .status(200)
    .json({ message: "Password updated successfully", success: true });
};

//password reset
export const handlePasswordReset = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  //find user by email
  const user = User.findOne({ email });

  //check if user found
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (otp && newPassword) {
    // Check if OTP is valid and within the expiration time
    if (
      user.passwordResetOTP !== otp ||
      user.passwordResetExpires < Date.now()
    ) {
      return next(new AppError("Invalid or expired OTP", 400));
    }

    //hash password
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    // Update user's password and clear OTP fields
    user.password = hashedPassword;
    user.passwordResetOTP = null;
    user.passwordResetExpires = null;

    await user.save();
    return res
      .status(200)
      .json({ message: "Password reset successfully", success: true });
  }

  //generate OTP
  const newOtp = Math.floor(100000 + Math.random() * 900000);

  //store otp in the document
  user.passwordResetOTP = newOtp;
  user.passwordResetExpires = Date.now() + 500000;
  await user.save();

  //sent opt via user email
  await sendEmail(email, "Password Reset OTP", newOtp);

  // return response
  return res
    .status(200)
    .json({ message: "OTP sent successfully", success: true });
};

//Get all accounts associated to a specific recovery Email
export const getUsersByRecoveryEmail = async (req, res, next) => {
  //get the recovery email from body
  const { recoveryEmail } = req.body;

  // Find users with the specified recovery email, find will return list of users that have this recoveryEmail
  const users = await User.find({ recoveryEmail }).select("-password");

  //if there is no users having this recoveryEmail
  if (!users.length) {
    return res.status(404).json({
      message: "No users found with the specified recovery email",
      success: false,
    });
  }

  //return response
  return res.status(200).json({
    message: "Users retrieved successfully",
    success: true,
    data: users,
  });
};
