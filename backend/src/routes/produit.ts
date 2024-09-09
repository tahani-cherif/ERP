import express from "express";

import {
  getproduitValidator,
  updateproduitValidator,
  deleteproduitValidator,
  createproduitValidator,
} from "../utils/validators/produitValidator";
import {
  getProduits,
  createProduit,
  getProduit,
  updateProduit,
  deleteProduit,
} from "../controllers/produit";
import { allowedTo, protect } from "../controllers/auth";

const router = express.Router();

router
  .route("/")
  .get(protect, allowedTo("user", "agence"), getProduits)
  .post(
    protect,
    allowedTo("user", "agence"),
    createproduitValidator,
    createProduit
  );

router
  .route("/:id")
  .get(protect, allowedTo("user", "agence"), getproduitValidator, getProduit)
  .put(
    protect,
    allowedTo("user", "agence"),
    updateproduitValidator,
    updateProduit
  )
  .delete(
    protect,
    allowedTo("user", "agence"),
    deleteproduitValidator,
    deleteProduit
  );

export { router };
