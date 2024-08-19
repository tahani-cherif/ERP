import { Request, Response, NextFunction } from "express";
import banqueModel from "../models/banque";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";

// @desc    Get all Banques
// @route   GET api/Banques/
// @access  Private
const getBanques = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?._id;
  const Banques = await banqueModel.find({admin:userId});
  res.status(200).json({ results: Banques.length, data: Banques });
});

// @desc    Get specific Banque by id
// @route   GET api/Banques/:id
// @access  Private
const getBanque = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const Banque = await banqueModel.findById(id);
  if (!Banque) {
    return next(new ApiError(`Banque not found for this id ${id}`, 404));
  }
  res.status(200).json({ data: Banque });
});

// @desc    Create a new Banque
// @route   POST api/Banques/
// @access  Private
const createBanque = asyncHandler(async (req: any, res: Response) => {
  const body = req.body;
  const userId = req?.user?._id;
  const Banque = await banqueModel.create({...body,admin:userId});
  res.status(201).json({ data: Banque });
});

// @desc    Update specified Banque
// @route   PUT api/Banques/:id
// @access  Private
const updateBanque = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const Banque = await banqueModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!Banque) {
    return next(new ApiError(`Banque not found for this id ${id}`, 404));
  }
  res.status(200).json({ data: Banque });
});

// @desc    Delete specified Banque
// @route   DELETE api/Banques/:id
// @access  Private
const deleteBanque = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const Banque = await banqueModel.findByIdAndDelete(id);
  if (!Banque) {
    return next(new ApiError(`Banque not found for this id ${id}`, 404));
  }
  res.status(204).send();
});

export {
  getBanques,
  getBanque,
  createBanque,
  updateBanque,
  deleteBanque,
};
