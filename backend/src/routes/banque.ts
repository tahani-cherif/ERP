import express from "express";

import {
  getBanqueValidator,
  updateBanqueValidator,
  deleteBanqueValidator,
  createBanqueValidator,
} from "../utils/validators/banqueValidator";
import {
  getBanques,
  createBanque,
  getBanque,
  updateBanque,
  deleteBanque,
} from "../controllers/banque";
import { allowedTo, protect } from "../controllers/auth";

const router = express.Router();

router
  .route("/")
  .get(protect, allowedTo("user", "agence"), getBanques)
  .post(
    protect,
    allowedTo("user", "agence"),
    createBanqueValidator,
    createBanque
  );

router
  .route("/:id")
  .get(protect, allowedTo("user", "agence"), getBanqueValidator, getBanque)
  .put(
    protect,
    allowedTo("user", "agence"),
    updateBanqueValidator,
    updateBanque
  )
  .delete(
    protect,
    allowedTo("user", "agence"),
    deleteBanqueValidator,
    deleteBanque
  );

export { router };
