import { Request, Response, NextFunction } from "express";
import userModel from "../models/user";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";
import bcrypt from "bcryptjs";

// @desc    Get all users
// @route   GET api/users/
// @access  Private
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userModel.find({});
  res.status(200).json({ results: users.length, data: users });
});

// @desc    Get specific user by id
// @route   GET api/users/:id
// @access  Private
const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    return next(new ApiError(`User not found for this id ${id}`, 404));
  }
  res.status(200).json({ data: user });
});

// @desc    Create a new user
// @route   POST api/users/
// @access  Private
const createUser = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const user = await userModel.create(body);
  res.status(201).json({ data: user });
});

// @desc    Update specified user
// @route   PUT api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!user) {
    return next(new ApiError(`User not found for this id ${id}`, 404));
  }
  res.status(200).json({ data: user });
});

// @desc    Delete specified user
// @route   DELETE api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    return next(new ApiError(`User not found for this id ${id}`, 404));
  }
  res.status(204).send();
});

// @desc    Update password
// @route   PUT api/users/:id/password
// @access  Private
const changeUserPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    { password: hashedPassword },
    { new: true }
  );
  if (!user) {
    return next(new ApiError(`User not found for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

// Export all functions
export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
};
