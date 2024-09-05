import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getclientValidator = [
  check("id").isMongoId().withMessage("Invalid client id format"),
  validatorMiddleware,
];

export const createclientValidator = [
  check("fullName").notEmpty().withMessage("fullName required"),
  check("address").optional(),
  check("phone").optional(),
  check("email").optional(),
  check("matriculeFiscale").optional(),
  validatorMiddleware,
];

export const updateclientValidator = [
  check("fullName").optional(),
  check("address").optional(),
  check("phone").optional(),
  check("email").optional(),
  check("matriculeFiscale").optional(),
  validatorMiddleware,
];

export const deleteclientValidator = [
  check("id").isMongoId().withMessage("Invalid client id format"),
  validatorMiddleware,
];
