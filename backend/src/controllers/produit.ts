import { Request, Response, NextFunction } from "express";
import produitModel from "../models/produit";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";

// @desc    Get all produits
// @route   GET api/produits/
// @access  Private
const getProduits = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?._id;
  const produits = await produitModel
    .find({ admin: userId })
    .sort({ createdAt: -1 });
  res.status(200).json({ results: produits.length, data: produits });
});

// @desc    Get specific Produit by id
// @route   GET api/produits/:id
// @access  Private
const getProduit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const produit = await produitModel.findById(id);
    if (!produit) {
      return next(new ApiError(`produit not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: produit });
  }
);

// @desc    Create a new produit
// @route   POST api/produits/
// @access  Private
const createProduit = asyncHandler(async (req: any, res: Response) => {
  const body = req.body;
  const userId = req?.user?._id;
  const produit = await produitModel.create({ ...body, admin: userId });
  res.status(201).json({ data: produit });
});

// @desc    Update specified produit
// @route   PUT api/produits/:id
// @access  Private
const updateProduit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const produit = await produitModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!produit) {
      return next(new ApiError(`produit not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: produit });
  }
);

// @desc    Delete specified produit
// @route   DELETE api/produits/:id
// @access  Private
const deleteProduit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const produit = await produitModel.findByIdAndDelete(id);
    if (!produit) {
      return next(new ApiError(`produit not found for this id ${id}`, 404));
    }
    res.status(204).send();
  }
);

export { getProduits, getProduit, createProduit, updateProduit, deleteProduit };
