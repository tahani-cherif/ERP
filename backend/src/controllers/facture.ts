import { Request, Response, NextFunction } from "express";
import factureModel from "../models/facture";
import produitModel from "../models/produit";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";

// @desc    Get all factures
// @route   GET api/factures/
// @access  Private
const getFacturesClient = asyncHandler(async (req: any, res: Response) => {
  const userId = req?.user?._id;
  const factures = await factureModel.find({admin:userId}).populate("client").populate('articles.produit');
  console.log(factures.length)
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
// @desc    Update status facture
// @route   PUT api/factures/status/:id
// @access  Private
const updateStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const facture = await factureModel.findOneAndUpdate({ _id: id }, { statut: req.body.status }, { new: true });

  if (!facture) {
    return next(new ApiError(`facture not found for this id ${id}`, 404));
  }

  if (req.body.status === "paid" && req.body.type === "vente") {
    await Promise.all(
      facture.articles.map(async (article: any) => {
        const produit = await produitModel.findById(article.produit);
        if (produit) {
          const newStock = Math.max(0, Number(produit.stock || 0) - Number(article.quantite));
          const newHistorique =produit?.historique ?[ ...produit.historique as any ,{type:"sorte",date:new Date(),quantite:Number(article.quantite)} ]:[]

          await produitModel.findByIdAndUpdate(
            article.produit,
            { stock: newStock, historique: newHistorique },
            { new: true }
          );
        }
      })
    );
  }
  if (req.body.status === "paid" && req.body.type === "achat") {
    await Promise.all(
      facture.articles.map(async (article: any) => {
        const produit = await produitModel.findById(article.produit);
        if (produit) {
          const newStock = Math.max(0, Number(produit.stock || 0) +Number(article.quantite));
          const newHistorique =produit?.historique ?[ ...produit.historique as any ,{type:"entre",date:new Date(),quantite:Number(article.quantite)} ]:[]

          await produitModel.findByIdAndUpdate(
            article.produit,
            { stock: newStock, historique: newHistorique },
            { new: true }
          );
        }
      })
    );
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
  updateStatus
};
