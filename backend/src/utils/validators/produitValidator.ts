import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getproduitValidator = [
  check("id").isMongoId().withMessage("Invalid produit id format"),
  validatorMiddleware,
];

export const createproduitValidator = [
  check("reference").notEmpty().withMessage("reference required"),
  check("name").notEmpty().withMessage("name required"),
  check("price").notEmpty().withMessage("price required"),
  check("description").optional(),
  validatorMiddleware,
];

export const updateproduitValidator = [
  check("reference").optional(),
  check("name").optional(),
  check("description").optional(),
  check("price").optional(),
  validatorMiddleware,
];

export const deleteproduitValidator = [
  check("id").isMongoId().withMessage("Invalid produit id format"),
  validatorMiddleware,
];
