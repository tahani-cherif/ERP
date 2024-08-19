import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getBanqueValidator = [
  check("id").isMongoId().withMessage("Invalid Banque id format"),
  validatorMiddleware,
];

export const createBanqueValidator = [
  check("banque").notEmpty().withMessage("name banque required"),
  check("rib").notEmpty().withMessage("rib required"),
  check("iban").notEmpty().withMessage("iban required"),
  check("swift").notEmpty().withMessage("swift required"),
  ,
  validatorMiddleware,
];

export const updateBanqueValidator = [
  check("banque").optional(),
  check("rib").optional(),
  check("iban").optional(),
  check("swift").optional(),
  validatorMiddleware,
];

export const deleteBanqueValidator = [
  check("id").isMongoId().withMessage("Invalid Banque id format"),
  validatorMiddleware,
];

