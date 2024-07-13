import joi from "joi";

export const addCompanySchema = joi
  .object({
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    companyEmail: joi.string().email().required(),
    numberOfEmployees: joi
      .string()
      .pattern(new RegExp(/^\d{1,2}-\d{1,2}$/))
      .required(),
  })
  .required();

export const updateCompanySchema = joi.object({
  companyName: joi.string(),
  description: joi.string(),
  industry: joi.string(),
  address: joi.string(),
  companyEmail: joi.string().email(),
  numberOfEmployees: joi.string().pattern(new RegExp(/^\d{1,2}-\d{1,2}$/)),
});
