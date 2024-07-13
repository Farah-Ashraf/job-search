import joi from "joi";

export const addJobSchema = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().required(),
    softSkills: joi.array().required(),
  })
  .required();

export const updateJobSchema = joi.object({
  jobTitle: joi.string(),
  jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
  workingTime: joi.string().valid("part-time", "full-time"),
  seniorityLevel: joi
    .string()
    .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
  jobDescription: joi.string(),
  technicalSkills: joi.array(),
  softSkills: joi.array(),
});

export const applyToJobSchema = joi.object({
  userTechSkills: joi.string().required(),
  userSoftSkills: joi.string().required(),
});
