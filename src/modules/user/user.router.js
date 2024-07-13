//import
import { Router } from "express";
import { auth } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validation.js";
import {
  deleteUserAccount,
  getAnotherUserAccountData,
  handlePasswordReset,
  updatePassword,
  updateUser,
  getUsersByRecoveryEmail,
  getUserAccountData,
} from "./user.controller.js";
import {
  changePasswordSchema,
  updateUserInfoSchema,
  usersWithSameRecoveryEmailSchema,
} from "./user.validate.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";

//create Router
const userRouter = Router();

//routings
userRouter.put(
  "/update-info",
  auth,
  validate(updateUserInfoSchema),
  asyncHandler(updateUser)
);
userRouter.delete("/delete-account", auth, asyncHandler(deleteUserAccount));
userRouter.get("/user-account-data", auth, asyncHandler(getUserAccountData));
userRouter.get(
  "/search-user-account-data/:searchUserId",
  auth,
  asyncHandler(getAnotherUserAccountData)
);
userRouter.put(
  "/update-password",
  validate(changePasswordSchema),
  auth,
  asyncHandler(updatePassword)
);
userRouter.post(
  "/password-reset",
  validate(changePasswordSchema),
  asyncHandler(handlePasswordReset)
);
userRouter.get(
  "/users-with-same-recovery-email",
  validate(usersWithSameRecoveryEmailSchema),
  asyncHandler(getUsersByRecoveryEmail)
);

//export
export default userRouter;
