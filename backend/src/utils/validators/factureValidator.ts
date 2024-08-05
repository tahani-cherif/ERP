import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getfactureValidator = [
  check("id").isMongoId().withMessage("Invalid facture id format"),
  validatorMiddleware,
];
export const createfactureValidator = [
  check("articles")
    .isArray({ min: 1 })
    .withMessage("Au moins un article requis")
    .custom((articles) => {
      for (let article of articles) {
        if (!article.produit) {
          throw new Error("Description de l'article requise");
        }
        if (!article.quantite) {
          throw new Error("Quantité de l'article requise");
        }
      }
      return true;
    }),
  check("total_general")
    .notEmpty()
    .withMessage("Total général requis"),
  validatorMiddleware, // Pas de virgule supplémentaire ici
];

export const updatefactureValidator = [
  check("articles")
  .isArray({ min: 1 })
  .withMessage("Au moins un article requis")
  .custom((articles) => {
    for (let article of articles) {
      if (!article.produit) {
        throw new Error("Description de l'article requise");
      }
      if (!article.quantite) {
        throw new Error("Quantité de l'article requise");
      }
    }
    return true;
  }).optional(),
check("total_general")
  .notEmpty()
  .withMessage("Total général requis").optional(),
  validatorMiddleware,
];

export const deletefactureValidator = [
  check("id").isMongoId().withMessage("Invalid facture id format"),
  validatorMiddleware,
];

