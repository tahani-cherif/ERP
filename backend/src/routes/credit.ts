import express from "express";

import {
  getCreditValidator,
  updateCreditValidator,
  deleteCreditValidator,
  createCreditValidator,
} from "../utils/validators/creditValidator";
import {
  getCredits,
  createCredit,
  getCredit,
  updateCredit,
  deleteCredit,
} from "../controllers/credit";
import { allowedTo, protect } from "../controllers/auth";

const router = express.Router();

router
  .route("/")
  .get(protect, allowedTo("user"), getCredits)
  .post(protect, allowedTo("user"), createCreditValidator, createCredit);

router
  .route("/:id")
  .get(protect, allowedTo("user"), getCreditValidator, getCredit)
  .put(protect, allowedTo("user"), updateCreditValidator, updateCredit)
  .delete(protect, allowedTo("user"), deleteCreditValidator, deleteCredit);

export { router };
