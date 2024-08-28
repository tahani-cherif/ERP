import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface IFacture extends Document {
  client: mongoose.Schema.Types.ObjectId;
  fournisseur: mongoose.Schema.Types.ObjectId;
  date: Date;
  total_general: Number;
  statut: string;
  tva: number;
  totalHTV: number;
  avance: number;
  reste: number;
  modepaiement: string;
  numero: string;
  articles: {
    produit: mongoose.Schema.Types.ObjectId;
    quantite: Number;
  }[];
  banque: mongoose.Schema.Types.ObjectId;
  admin: mongoose.Schema.Types.ObjectId;
}

const factureSchema = new Schema<IFacture>(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fournisseur",
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    articles: [
      {
        produit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "produit",
        },
        quantite: {
          type: Number,
          required: true,
        },
      },
    ],
    total_general: {
      type: Number,
      required: true,
    },
    avance: {
      type: Number,
      required: false,
    },
    reste: {
      type: Number,
      required: false,
    },
    totalHTV: {
      type: Number,
      required: true,
    },
    tva: {
      type: Number,
      required: false,
    },
    modepaiement: {
      type: String,
      required: true,
    },
    numero: {
      type: String,
      required: false,
    },
    statut: {
      type: String,
      enum: ["pending", "paid", "cancelled", "semi-paid"],
      default: "pending",
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    banque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "banque",
      required: false,
    },
  },
  { timestamps: true }
);

// Create and export the model
const Facture: Model<IFacture> = model<IFacture>("facture", factureSchema);
export default Facture;
