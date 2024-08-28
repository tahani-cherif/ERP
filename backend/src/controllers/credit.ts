import { Request, Response, NextFunction } from "express";
import creditModel from "../models/credit";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";

// @desc    Get all Credits
// @route   GET api/Credits/
// @access  Private
const getCredits = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?._id;
  const Credits = await creditModel
    .find({ admin: userId })
    .populate("banque")
    .sort({ createdAt: -1 });
  res.status(200).json({ results: Credits.length, data: Credits });
});

// @desc    Get specific Credit by id
// @route   GET api/Credits/:id
// @access  Private
const getCredit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const Credit = await creditModel.findById(id).populate("banque");
    if (!Credit) {
      return next(new ApiError(`Credit not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: Credit });
  }
);

// @desc    Create a new Credit
// @route   POST api/Credits/
// @access  Private
const createCredit = asyncHandler(async (req: any, res: Response) => {
  const body = req.body;
  const userId = req?.user?._id;
  const Credit = await creditModel.create({ ...body, admin: userId });
  const Creditget = await creditModel.findById(Credit?._id).populate("banque");
  res.status(201).json({ data: Creditget });
});

// @desc    Update specified Credit
// @route   PUT api/Credits/:id
// @access  Private
const updateCredit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const Credit = await creditModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!Credit) {
      return next(new ApiError(`Credit not found for this id ${id}`, 404));
    }
    const Creditget = await creditModel
      .findById(Credit?._id)
      .populate("banque");
    res.status(200).json({ data: Creditget });
  }
);

// @desc    Delete specified Credit
// @route   DELETE api/Credits/:id
// @access  Private
const deleteCredit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const Credit = await creditModel.findByIdAndDelete(id);
    if (!Credit) {
      return next(new ApiError(`Credit not found for this id ${id}`, 404));
    }
    res.status(204).send();
  }
);

export { getCredits, getCredit, createCredit, updateCredit, deleteCredit };
