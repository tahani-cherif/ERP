import express from "express";

import {
  getclientValidator,
  updateclientValidator,
  deleteclientValidator,
  createclientValidator,
} from "../utils/validators/clientValidator";
import {
  getClients,
  createClient,
  getClient,
  updateClient,
  deleteClient,
} from "../controllers/client";
import { allowedTo, protect } from "../controllers/auth";

const router = express.Router();


router
  .route("/")
  .get(protect, allowedTo("user"),getClients)
  .post(protect, allowedTo("user"), createclientValidator, createClient);


router
  .route("/:id")
  .get(protect, allowedTo("user"),getclientValidator, getClient)
  .put(protect, allowedTo("user"), updateclientValidator, updateClient)
  .delete(protect, allowedTo("user"), deleteclientValidator, deleteClient);

export { router };
