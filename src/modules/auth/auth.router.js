//import
import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { signIn, signUp } from "./auth.controller.js";
import { signInSchema, signUpSchema } from "./auth.validate.js";

//create router
const authRouter = Router();

//routers
authRouter.post("/sign-up", validate(signUpSchema), asyncHandler(signUp));
authRouter.post("/sign-in", validate(signInSchema), asyncHandler(signIn));

//export
export default authRouter;
