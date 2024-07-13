//imports
import joi from "joi";

export const updateUserInfoSchema = joi
  .object({
    email: joi.string().email().optional(),
    mobileNumber: joi.string().optional(),
    recoveryEmail: joi.string().email().optional(),
    DOB: joi.date().iso().optional(),
    lastName: joi.string().optional(),
    firstName: joi.string().optional(),
  })
  .required();

export const changePasswordSchema = joi
  .object({
    password: joi.string().min(5).required(),
  })
  .required();

export const usersWithSameRecoveryEmailSchema = joi
  .object({
    recoveryEmail: joi.string().email().required(),
  })
  .required();
