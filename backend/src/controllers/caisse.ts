import { Request, Response, NextFunction } from "express";
import caisseModel from "../models/caisse";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";

// @desc    Get all Caisses
// @route   GET api/Caisses/
// @access  Private
const getCaisses = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?.admin;
  const Caisses = await caisseModel
    .find({ admin: userId })
    .sort({ createdAt: -1 });
  res.status(200).json({ results: Caisses.length, data: Caisses });
});

// @desc    Get specific Caisse by id
// @route   GET api/Caisses/:id
// @access  Private
const getCaisse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const Caisse = await caisseModel.findById(id);
    if (!Caisse) {
      return next(new ApiError(`Caisse not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: Caisse });
  }
);

// @desc    Create a new Caisse
// @route   POST api/Caisses/
// @access  Private
const createCaisse = asyncHandler(async (req: any, res: Response) => {
  const body = req.body;
  const userId = req?.user?.admin;
  const Caisse = await caisseModel.create({ ...body, admin: userId });
  res.status(201).json({ data: Caisse });
});

// @desc    Update specified Caisse
// @route   PUT api/Caisses/:id
// @access  Private
const updateCaisse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const Caisse = await caisseModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!Caisse) {
      return next(new ApiError(`Caisse not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: Caisse });
  }
);

// @desc    Delete specified Caisse
// @route   DELETE api/Caisses/:id
// @access  Private
const deleteCaisse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const Caisse = await caisseModel.findByIdAndDelete(id);
    if (!Caisse) {
      return next(new ApiError(`Caisse not found for this id ${id}`, 404));
    }
    res.status(204).send();
  }
);

export { getCaisses, getCaisse, createCaisse, updateCaisse, deleteCaisse };
