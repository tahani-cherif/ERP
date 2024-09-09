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
  updateStatus,
} from "../controllers/facture";
import { allowedTo, protect } from "../controllers/auth";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    allowedTo("user", "agence"),
    createfactureValidator,
    createFacture
  );
router
  .route("/vente")
  .get(protect, allowedTo("user", "agence"), getFacturesClient);
router
  .route("/status/:id")
  .put(protect, allowedTo("user", "agence"), updateStatus);
router
  .route("/achat")
  .get(protect, allowedTo("user", "agence"), getFacturesFournisseur);

router
  .route("/:id")
  .get(protect, allowedTo("user", "agence"), getfactureValidator, getFacture)
  .put(
    protect,
    allowedTo("user", "agence"),
    updatefactureValidator,
    updateFacture
  )
  .delete(
    protect,
    allowedTo("user", "agence"),
    deletefactureValidator,
    deleteFacture
  );

export { router };
