import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getfactureValidator = [
  check("id").isMongoId().withMessage("Invalid facture id format"),
  validatorMiddleware,
];

export const createfactureValidator = [
  check("numero")
  .notEmpty()
  .withMessage("Numéro de facture requis"),
check("client")
  .notEmpty()
  .withMessage("Nom du client requis"),
check("articles")
  .isArray({ min: 1 })
  .withMessage("Au moins un article requis")
  .custom((articles) => {
    for (let article of articles) {
      if (!article.description) {
        throw new Error("Description de l'article requise");
      }
      if (!article.quantite) {
        throw new Error("Quantité de l'article requise");
      }
      if (!article.prix_unitaire) {
        throw new Error("Prix unitaire de l'article requis");
      }
      if (!article.total) {
        throw new Error("Total de l'article requis");
      }
    }
    return true;
  }),
check("total_general")
  .notEmpty()
  .withMessage("Total général requis"),
  ,
  validatorMiddleware,
];

export const updatefactureValidator = [
  check("fullName").optional(),
  check("address").optional(),
  check("phone")
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone must be 8 characters"),
  check("email").optional().isEmail().withMessage("Invalid email format"),
  check("matriculeFiscale")
    .optional(),
  validatorMiddleware,
];

export const deletefactureValidator = [
  check("id").isMongoId().withMessage("Invalid facture id format"),
  validatorMiddleware,
];

