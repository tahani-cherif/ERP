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
  .get(protect, allowedTo("user", "agence"), getCaisses)
  .post(
    protect,
    allowedTo("user", "agence"),
    createCaisseValidator,
    createCaisse
  );

router
  .route("/:id")
  .get(protect, allowedTo("user", "agence"), getCaisseValidator, getCaisse)
  .put(
    protect,
    allowedTo("user", "agence"),
    updateCaisseValidator,
    updateCaisse
  )
  .delete(
    protect,
    allowedTo("user", "agence"),
    deleteCaisseValidator,
    deleteCaisse
  );

export { router };
