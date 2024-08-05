import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getproduitValidator = [
  check("id").isMongoId().withMessage("Invalid produit id format"),
  validatorMiddleware,
];

export const createproduitValidator = [
  check("name").notEmpty().withMessage("name required"),
  check("description").notEmpty().withMessage("description required"),
  check("price")
    .notEmpty()
    .withMessage("price required")
    ,
  validatorMiddleware,
];

export const updateproduitValidator = [
  check("name").optional(),
  check("description").optional(),
  check("price")
    .optional(),
  validatorMiddleware,
];

export const deleteproduitValidator = [
  check("id").isMongoId().withMessage("Invalid produit id format"),
  validatorMiddleware,
];

