import express from "express";
import {
  loginValidator,
  signupValidator,
  forgtpasswordvalidator,
  updatepasswordValidator,
} from "../utils/validators/authValidator"
import {
  login,
  signup,
  forgetPassword,
  updatePassword,
  // approvedAccount,
} from "../controllers/auth";

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgetpassword").post(forgtpasswordvalidator, forgetPassword);
router.route("/updatepassword").put(updatepasswordValidator, updatePassword);
// router.route("/approvedaccount/:token").get(approvedAccount);

export { router };
