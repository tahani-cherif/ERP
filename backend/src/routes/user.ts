import express from "express";

import {
  getuserValidator,
  updateuserValidator,
  deleteuserValidator,
  createuserValidator,
  changeuserpasswordvalidate,
} from "../utils/validators/userValidator";
import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} from "../controllers/user";
import { allowedTo, protect } from "../controllers/auth";

const router = express.Router();

router.put(
  "/changepassword/:id",
  changeuserpasswordvalidate,
  changeUserPassword
);

router
  .route("/")
  .get(getUsers)
  .post(protect, allowedTo("admin"), createuserValidator, createUser);

router
  .route("/:id")
  .get(getuserValidator, getUser)
  .put(
    protect,
    allowedTo("admin", "user", "agence"),
    updateuserValidator,
    updateUser
  )
  .delete(protect, allowedTo("admin"), deleteuserValidator, deleteUser);

export { router };
