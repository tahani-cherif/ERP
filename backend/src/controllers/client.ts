import { Request, Response, NextFunction } from "express";
import clientModel from "../models/client";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";

// @desc    Get all clients
// @route   GET api/clients/
// @access  Private
const getClients = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?.admin;
  const clients = await clientModel
    .find({ admin: userId })
    .sort({ createdAt: -1 });
  res.status(200).json({ results: clients.length, data: clients });
});

// @desc    Get specific Client by id
// @route   GET api/clients/:id
// @access  Private
const getClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const client = await clientModel.findById(id);
    if (!client) {
      return next(new ApiError(`client not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: client });
  }
);

// @desc    Create a new client
// @route   POST api/clients/
// @access  Private
const createClient = asyncHandler(async (req: any, res: Response) => {
  const body = req.body;
  const userId = req?.user?.admin;
  const client = await clientModel.create({ ...body, admin: userId });
  res.status(201).json({ data: client });
});

// @desc    Update specified client
// @route   PUT api/clients/:id
// @access  Private
const updateClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const client = await clientModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!client) {
      return next(new ApiError(`client not found for this id ${id}`, 404));
    }
    res.status(200).json({ data: client });
  }
);

// @desc    Delete specified client
// @route   DELETE api/clients/:id
// @access  Private
const deleteClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const client = await clientModel.findByIdAndDelete(id);
    if (!client) {
      return next(new ApiError(`client not found for this id ${id}`, 404));
    }
    res.status(204).send();
  }
);

export { getClients, getClient, createClient, updateClient, deleteClient };
