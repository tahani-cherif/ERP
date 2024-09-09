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
  .get(protect, allowedTo("user", "agence"), getClients)
  .post(
    protect,
    allowedTo("user", "agence"),
    createclientValidator,
    createClient
  );

router
  .route("/:id")
  .get(protect, allowedTo("user", "agence"), getclientValidator, getClient)
  .put(
    protect,
    allowedTo("user", "agence"),
    updateclientValidator,
    updateClient
  )
  .delete(
    protect,
    allowedTo("user", "agence"),
    deleteclientValidator,
    deleteClient
  );

export { router };
