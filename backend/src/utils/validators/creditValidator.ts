import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getCreditValidator = [
  check("id").isMongoId().withMessage("Invalid Credit id format"),
  validatorMiddleware,
];

export const createCreditValidator = [
  check("banque").notEmpty().withMessage("name banque required"),
  check("type").notEmpty().withMessage("type required"),
  check("echeance").notEmpty().withMessage("echeance required"),
  check("principal").notEmpty().withMessage("principal required"),
  check("interet").notEmpty().withMessage("interet required"),
  check("total").notEmpty().withMessage("total required"),
  check("encours").notEmpty().withMessage("encours required"),
  validatorMiddleware,
];

export const updateCreditValidator = [
  check("banque").optional(),
  check("type").optional(),
  check("echeance").optional(),
  check("principal").optional(),
  check("interet").optional(),
  check("total").optional(),
  check("encours").optional(),
  validatorMiddleware,
];

export const deleteCreditValidator = [
  check("id").isMongoId().withMessage("Invalid Credit id format"),
  validatorMiddleware,
];
