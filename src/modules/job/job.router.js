import { Router } from "express";
import {
  addJob,
  deleteJob,
  getJobsWithCompanyInformation,
  updateJob,
  getCompanyJobs,
  filterJobs,
  applyToJob,
} from "./job.controller.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import { validate } from "./../../middleware/validation.js";
import {
  addJobSchema,
  updateJobSchema,
  applyToJobSchema,
} from "./job.validate.js";
import { auth } from "./../../middleware/authentication.js";
import { validateHR } from "../../middleware/validateHR.js";
import { validateUser } from "./../../middleware/validateUser.js";
import upload from "../../../config/multer.js";
//create router
const jobRouter = Router();

//routers
jobRouter.post(
  "/",
  auth,
  validateHR,
  validate(addJobSchema),
  asyncHandler(addJob)
);
jobRouter.put("/:id", auth, validate(updateJobSchema), asyncHandler(updateJob));

jobRouter.delete("/:id", auth, asyncHandler(deleteJob));

jobRouter.get(
  "/jobs-with-company-info",
  auth,
  asyncHandler(getJobsWithCompanyInformation)
);

jobRouter.get("/company/:companyId", auth, asyncHandler(getCompanyJobs));

jobRouter.get("/", auth, asyncHandler(filterJobs));

jobRouter.post("/:id/apply", auth, validateUser, upload, validate(applyToJobSchema), applyToJob);

//export
export default jobRouter;
