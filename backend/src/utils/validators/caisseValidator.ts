import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getCaisseValidator = [
  check("id").isMongoId().withMessage("Invalid Caisse id format"),
  validatorMiddleware,
];

export const createCaisseValidator = [
  check("designation").notEmpty().withMessage("designation banque required"),
  check("date").notEmpty().withMessage("date required"),
  check("decaissement").notEmpty().withMessage("decaissement required"),
  check("encaissement").notEmpty().withMessage("encaissement required"),
  validatorMiddleware,
];

export const updateCaisseValidator = [
  check("designation").optional(),
  check("date").optional(),
  check("decaissement").optional(),
  check("encaissement").optional(),
  validatorMiddleware,
];

export const deleteCaisseValidator = [
  check("id").isMongoId().withMessage("Invalid Caisse id format"),
  validatorMiddleware,
];
