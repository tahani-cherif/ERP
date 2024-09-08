import { Request, Response, NextFunction } from "express";
import fornisseurModel from "../models/fornisseur";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";

// @desc    Get all fornisseurs
// @route   GET api/fornisseurs/
// @access  Private
const getFornisseurs = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?.admin;
  const fornisseurs = await fornisseurModel
    .find({ admin: userId })
    .sort({ createdAt: -1 });
  res.status(200).json({ results: fornisseurs.length, data: fornisseurs });
});

// @desc    Get specific fornisseur by id
// @route   GET api/fornisseurs/:id
// @access  Private
const getFornisseur = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const fornisseur = await fornisseurModel.findById(id);
    if (!fornisseur) {
      return next(new ApiError(`fornisseur not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: fornisseur });
  }
);

// @desc    Create a new fornisseur
// @route   POST api/fornisseurs/
// @access  Private
const createFornisseur = asyncHandler(async (req: any, res: Response) => {
  const body = req.body;
  const userId = req?.user?.admin;
  const fornisseur = await fornisseurModel.create({ ...body, admin: userId });
  res.status(201).json({ data: fornisseur });
});

// @desc    Update specified fornisseur
// @route   PUT api/fornisseurs/:id
// @access  Private
const updateFornisseur = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const fornisseur = await fornisseurModel.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!fornisseur) {
      return next(new ApiError(`fornisseur not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: fornisseur });
  }
);

// @desc    Delete specified fornisseur
// @route   DELETE api/fornisseurs/:id
// @access  Private
const deleteFornisseur = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const fornisseur = await fornisseurModel.findByIdAndDelete(id);
    if (!fornisseur) {
      return next(new ApiError(`fornisseur not found for this id ${id}`, 404));
    }
    res.status(204).send();
  }
);

export {
  getFornisseurs,
  getFornisseur,
  createFornisseur,
  updateFornisseur,
  deleteFornisseur,
};
