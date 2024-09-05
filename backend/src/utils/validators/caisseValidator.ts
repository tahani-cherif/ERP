import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getCaisseValidator = [
  check("id").isMongoId().withMessage("Invalid Caisse id format"),
  validatorMiddleware,
];

export const createCaisseValidator = [
  check("designation").optional(),
  check("date").notEmpty().withMessage("date required"),
  check("decaissement").optional(),
  check("encaissement").optional(),
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
