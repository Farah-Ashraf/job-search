import joi from "joi";

//sign-up data validation
export const signUpSchema = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
    recoveryEmail: joi.string().email().optional(),
    DOB: joi.date().iso().required(),
    mobileNumber: joi.string().required(),
    role: joi.string().valid("User", "company_HR").required(),
  })
  .required();

//sign-in data validation
export const signInSchema = joi
  .object({
    identifier: joi.string().required(),
    password: joi.string().required(),
  })
  .required();
