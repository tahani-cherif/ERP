import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getfornisseurValidator = [
  check("id").isMongoId().withMessage("Invalid fornisseur id format"),
  validatorMiddleware,
];

export const createfornisseurValidator = [
  check("fullName").notEmpty().withMessage("fullName required"),
  check("address").notEmpty().withMessage("address required"),
  check("phone")
    .notEmpty()
    .withMessage("Phone required")
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone must be 8 characters"),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email format")
    ,
  check("matriculeFiscale")
    .notEmpty()
    .withMessage("matriculeFiscale required")
  ,
  validatorMiddleware,
];

export const updatefornisseurValidator = [
  check("fullName").optional(),
  check("address").optional(),
  check("phone")
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone must be 8 characters"),
  check("email").optional().isEmail().withMessage("Invalid email format"),
  check("matriculeFiscale")
    .optional(),
  validatorMiddleware,
];

export const deletefornisseurValidator = [
  check("id").isMongoId().withMessage("Invalid fornisseur id format"),
  validatorMiddleware,
];

