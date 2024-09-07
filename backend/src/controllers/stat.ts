import { Request, Response, NextFunction } from "express";
import banqueModel from "../models/banque";
import produitModel from "../models/produit";
import clientModel from "../models/client";
import factureModel from "../models/facture";
import fournisseurModel from "../models/fornisseur";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";

// @desc    Get count banque client fournissuer produit
// @route   GET api/stat/count
// @access  Private
const getCount = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?._id;
  const Banques = await banqueModel.countDocuments({ admin: userId });
  const produit = await produitModel.countDocuments({ admin: userId });
  const client = await clientModel.countDocuments({ admin: userId });
  const fournisseur = await fournisseurModel.countDocuments({ admin: userId });
  res.status(200).json({
    banque: Banques,
    produit: produit,
    client: client,
    fournisseur: fournisseur,
  });
});
// @desc    Get count banque client fournissuer produit
// @route   GET api/stat/stock
// @access  Private
const getstock = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?._id;
  const produit = await produitModel.find({ admin: userId });
  res.status(200).json({
    vendre:
      (produit.filter((item) => item.type === "vente").length * 100) /
      produit.length,
    achat:
      (produit.filter((item) => item.type === "achat").length * 100) /
      produit.length,
    produit: produit.length,
  });
});
// @desc    Get count banque client fournissuer produit
// @route   GET api/stat/facture
// @access  Private
const getachatvente = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?._id;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const achats = await factureModel.aggregate([
    {
      $match: {
        admin: userId,
        date: { $gte: sixMonthsAgo }, // Only include records from the last 6 months
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" }, // Group by month
          year: { $year: "$date" }, // Group by year
        },
        count: { $sum: 1 }, // Count the number of purchases
        items: { $push: "$$ROOT" }, // Push all documents into the "items" array
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
    },
  ]);

  let tabachat: any = [];
  let tabvente: any = [];
  let month: any = [];
  achats?.map((item) => {
    month.push(item?._id?.month + "/" + item?._id?.year);
    tabachat.push(item?.items?.filter((ele: any) => ele?.fournisseur).length);
    tabvente.push(item?.items?.filter((ele: any) => ele?.client).length);
  });

  res.status(200).json({ tabvente, tabachat, month });
});

export { getCount, getstock, getachatvente };
