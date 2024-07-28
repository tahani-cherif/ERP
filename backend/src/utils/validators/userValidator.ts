import { check, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import User from "../../models/user";

export const getuserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

export const createuserValidator = [
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
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  validatorMiddleware,
];

export const updateuserValidator = [
  check("firstName").optional(),
  check("lastName").optional(),
  check("phone")
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone must be 8 characters"),
  check("email").optional().isEmail().withMessage("Invalid email format"),
  check("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password too short"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  validatorMiddleware,
];

export const deleteuserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

export const changeuserpasswordvalidate = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  body("password").notEmpty().withMessage("You must enter your new password"),
  validatorMiddleware,
];
