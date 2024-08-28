import express from "express";

import {
  getCaisseValidator,
  updateCaisseValidator,
  deleteCaisseValidator,
  createCaisseValidator,
} from "../utils/validators/caisseValidator";
import {
  getCaisses,
  createCaisse,
  getCaisse,
  updateCaisse,
  deleteCaisse,
} from "../controllers/caisse";
import { allowedTo, protect } from "../controllers/auth";

const router = express.Router();

router
  .route("/")
  .get(protect, allowedTo("user"), getCaisses)
  .post(protect, allowedTo("user"), createCaisseValidator, createCaisse);

router
  .route("/:id")
  .get(protect, allowedTo("user"), getCaisseValidator, getCaisse)
  .put(protect, allowedTo("user"), updateCaisseValidator, updateCaisse)
  .delete(protect, allowedTo("user"), deleteCaisseValidator, deleteCaisse);

export { router };
