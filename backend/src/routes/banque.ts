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
  .get(protect, allowedTo("user"),getBanques)
  .post(protect, allowedTo("user"), createBanqueValidator, createBanque);


router
  .route("/:id")
  .get(protect, allowedTo("user"),getBanqueValidator, getBanque)
  .put(protect, allowedTo("user"), updateBanqueValidator, updateBanque)
  .delete(protect, allowedTo("user"), deleteBanqueValidator, deleteBanque);

export { router };
