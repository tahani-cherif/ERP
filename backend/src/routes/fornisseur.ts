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
  .get(protect, allowedTo("user"),getFornisseurs)
  .post(protect, allowedTo("user"), createfornisseurValidator, createFornisseur);


router
  .route("/:id")
  .get(protect, allowedTo("user"),getfornisseurValidator, getFornisseur)
  .put(protect, allowedTo("user"), updatefornisseurValidator, updateFornisseur)
  .delete(protect, allowedTo("user"), deletefornisseurValidator, deleteFornisseur);

export { router };
