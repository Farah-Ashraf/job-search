import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./../../../db/models/user.model.js";
import { AppError } from "./../../utils/appError.js";
import { sendEmail } from "./../../utils/sendEmail.js";

// sign-up api
export const signUp = async (req, res, next) => {
  //get the data from body
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body;

  //check existence
  const userExist = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (userExist) {
    return next(
      new AppError(
        "user already exist, please enter unique email and phone number",
        400
      )
    );
  }

  //create username by concating first and last name
  const username = firstName + lastName;

  //hash password
  const hashedPassword = bcrypt.hashSync(password, 8);

  //create user
  const user = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
    status: "offline",
  });
  const createdUser = await user.save();

  // to make the password doesn't return in the response because it it will be unsafe
  delete createdUser.password;

  //send mail to verify user email
  const token = jwt.sign({ email }, "verify_email");
  sendEmail(email, "Email Verification", token);

  return res.status(201).json({
    message: "User created successfully",
    success: true,
    data: createdUser,
  });
};

//sign-in api
export const signIn = async (req, res, next) => {
  //get data
  const { identifier, password } = req.body;

  //check for existence
  const userExist = await User.findOne({
    $or: [
      { email: identifier },
      { recoveryEmail: identifier },
      { mobileNumber: identifier },
    ],
  });
  if (!userExist) {
    return next(new AppError("Invalid credintials", 401)); // 401 unauthurized
  }

  //check for password
  const passwordCorrect = bcrypt.compareSync(password, userExist.password);
  if (!passwordCorrect) {
    return next(new AppError("Invalid credintials", 401));
  }

  //change status to online
  userExist.status = "online";
  await userExist.save();

  //generate token
  const accessToken = jwt.sign(
    {
      userId: userExist._id,
      userName: userExist.username,
      userRole: userExist.role,
    },
    "secret_key"
  );

  //return success message
  return res.status(200).json({
    message: "User logged-in successfully",
    success: true,
    accessToken,
  });
};
