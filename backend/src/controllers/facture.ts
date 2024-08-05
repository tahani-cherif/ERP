import { Request, Response, NextFunction } from "express";
import factureModel from "../models/facture";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";

// @desc    Get all factures
// @route   GET api/factures/
// @access  Private
const getFacturesClient = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?._id;
  const factures = await factureModel.find({admin:userId}).populate("client").populate('articles.produit');
  res.status(200).json({ results: factures.filter((item)=>item.client!==undefined).length, data: factures.filter((item)=>item.client!==undefined) });
});
const getFacturesFournisseur = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?._id;
  const factures = await factureModel.find({admin:userId}).populate('fournisseur').populate('articles.produit');
  res.status(200).json({ results: factures.filter((item)=>item.fournisseur!==undefined).length, data: factures.filter((item)=>item.fournisseur!==undefined) });
});

// @desc    Get specific facture by id
// @route   GET api/factures/:id
// @access  Private
const getFacture = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const facture = await factureModel.findById(id);
  if (!facture) {
    return next(new ApiError(`facture not found for this id ${id}`, 404));
  }
  res.status(200).json({ data: facture });
});

// @desc    Create a new facture
// @route   POST api/factures/
// @access  Private
const createFacture = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const facture = await factureModel.create(body);
  res.status(201).json({ data: facture });
});

// @desc    Update specified facture
// @route   PUT api/factures/:id
// @access  Private
const updateFacture = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const facture = await factureModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!facture) {
    return next(new ApiError(`facture not found for this id ${id}`, 404));
  }
  res.status(200).json({ data: facture });
});

// @desc    Delete specified facture
// @route   DELETE api/factures/:id
// @access  Private
const deleteFacture = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const facture = await factureModel.findByIdAndDelete(id);
  if (!facture) {
    return next(new ApiError(`facture not found for this id ${id}`, 404));
  }
  res.status(204).send();
});

export {
  getFacturesClient,
  getFacturesFournisseur,
  getFacture,
  createFacture,
  updateFacture,
  deleteFacture,
};
