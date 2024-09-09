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
  .get(protect, allowedTo("user", "agence"), getCredits)
  .post(
    protect,
    allowedTo("user", "agence"),
    createCreditValidator,
    createCredit
  );

router
  .route("/:id")
  .get(protect, allowedTo("user", "agence"), getCreditValidator, getCredit)
  .put(
    protect,
    allowedTo("user", "agence"),
    updateCreditValidator,
    updateCredit
  )
  .delete(
    protect,
    allowedTo("user", "agence"),
    deleteCreditValidator,
    deleteCredit
  );

export { router };
