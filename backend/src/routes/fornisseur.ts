import express from "express";

import {
  getfornisseurValidator,
  updatefornisseurValidator,
  deletefornisseurValidator,
  createfornisseurValidator,
} from "../utils/validators/fornisseurValidator";
import {
  getFornisseurs,
  createFornisseur,
  getFornisseur,
  updateFornisseur,
  deleteFornisseur,
} from "../controllers/fornisseur";
import { allowedTo, protect } from "../controllers/auth";

const router = express.Router();

router
  .route("/")
  .get(protect, allowedTo("user", "agence"), getFornisseurs)
  .post(
    protect,
    allowedTo("user", "agence"),
    createfornisseurValidator,
    createFornisseur
  );

router
  .route("/:id")
  .get(
    protect,
    allowedTo("user", "agence"),
    getfornisseurValidator,
    getFornisseur
  )
  .put(
    protect,
    allowedTo("user", "agence"),
    updatefornisseurValidator,
    updateFornisseur
  )
  .delete(
    protect,
    allowedTo("user", "agence"),
    deletefornisseurValidator,
    deleteFornisseur
  );

export { router };
