import express from "express";

import { allowedTo, protect } from "../controllers/auth";
import { getachatvente, getCount, getstock } from "../controllers/stat";

const router = express.Router();

router.route("/count").get(protect, allowedTo("user"), getCount);
router.route("/stock").get(protect, allowedTo("user"), getstock);
router.route("/facture").get(protect, allowedTo("user"), getachatvente);

export { router };
