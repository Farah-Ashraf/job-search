import { Router } from "express";
import {
  addCompany,
  deleteCompany,
  updateCompany,
  getCompany,
  getCompanyByName,
} from "./company.controller.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import { validate } from "./../../middleware/validation.js";
import { addCompanySchema, updateCompanySchema } from "./company.validate.js";
import { auth } from "./../../middleware/authentication.js";
import { validateHR } from "../../middleware/validateHR.js";
//create router
const companyRouter = Router();

//routers
companyRouter.post(
  "/",
  auth,
  validateHR,
  validate(addCompanySchema),
  asyncHandler(addCompany)
);
companyRouter.put(
  "/:id",
  auth,
  validateHR,
  validate(updateCompanySchema),
  asyncHandler(updateCompany)
);

companyRouter.get("/search-by-name", auth, asyncHandler(getCompanyByName));
companyRouter.delete("/:id", auth, validateHR, asyncHandler(deleteCompany));
companyRouter.get("/:id", auth, validateHR, asyncHandler(getCompany));

//export
export default companyRouter;
