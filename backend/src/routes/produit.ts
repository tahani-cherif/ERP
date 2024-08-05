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
  .get(protect, allowedTo("user"),getProduits)
  .post(protect, allowedTo("user"), createproduitValidator, createProduit);


router
  .route("/:id")
  .get(protect, allowedTo("user"),getproduitValidator, getProduit)
  .put(protect, allowedTo("user"), updateproduitValidator, updateProduit)
  .delete(protect, allowedTo("user"), deleteproduitValidator, deleteProduit);

export { router };
