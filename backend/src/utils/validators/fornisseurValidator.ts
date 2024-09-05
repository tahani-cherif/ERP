import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getfornisseurValidator = [
  check("id").isMongoId().withMessage("Invalid fornisseur id format"),
  validatorMiddleware,
];

export const createfornisseurValidator = [
  check("fullName").notEmpty().withMessage("fullName required"),
  check("address").optional(),
  check("phone").optional(),
  check("email").optional(),
  check("matriculeFiscale").optional(),
  validatorMiddleware,
];

export const updatefornisseurValidator = [
  check("fullName").optional(),
  check("address").optional(),
  check("phone").optional(),
  check("matriculeFiscale").optional(),
  validatorMiddleware,
];

export const deletefornisseurValidator = [
  check("id").isMongoId().withMessage("Invalid fornisseur id format"),
  validatorMiddleware,
];
