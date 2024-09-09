import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import User from "../../models/user";

export const signupValidator = [
  check("firstName").notEmpty().withMessage("firstName required"),
  check("lastName").notEmpty().withMessage("lastName required"),
  check("phone")
    .notEmpty()
    .withMessage("Phone required")
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone must be 8 characters"),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error("E-mail already in use"));
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Password too short")
    .custom((password, { req }) => {
      if (password !== req.body.passwordconfirm) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),
  check("passwordconfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),
  check("role")
    .isIn(["user", "admin", "agence"])
    .withMessage("Role must be either user or admin"),
  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validatorMiddleware,
];

export const forgtpasswordvalidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  // check("token").notEmpty().withMessage("token required"),
  validatorMiddleware,
];

export const updatepasswordValidator = [
  check("token").notEmpty().withMessage("token required"),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Password too short")
    .custom((password, { req }) => {
      if (password !== req.body.passwordconfirm) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),
  check("passwordconfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),
  validatorMiddleware,
];
