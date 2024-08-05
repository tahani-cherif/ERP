import express from "express";

import {
  getfactureValidator,
  updatefactureValidator,
  deletefactureValidator,
  createfactureValidator,
} from "../utils/validators/factureValidator";
import {
  getFacturesClient,
  getFacturesFournisseur,
  createFacture,
  getFacture,
  updateFacture,
  deleteFacture,
} from "../controllers/facture";
import { allowedTo, protect } from "../controllers/auth";

const router = express.Router();


router
  .route("/")
  .post(protect, allowedTo("user"), createfactureValidator, createFacture);
router
  .route("/vente")
  .get(protect, allowedTo("user"),getFacturesClient)
router
  .route("/achat")
  .get(protect, allowedTo("user"),getFacturesFournisseur)


router
  .route("/:id")
  .get(protect, allowedTo("user"),getfactureValidator, getFacture)
  .put(protect, allowedTo("user"), updatefactureValidator, updateFacture)
  .delete(protect, allowedTo("user"), deletefactureValidator, deleteFacture);

export { router };
