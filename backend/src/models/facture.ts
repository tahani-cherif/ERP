import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface IFacture extends Document {
  client: mongoose.Schema.Types.ObjectId;
  fournisseur: mongoose.Schema.Types.ObjectId;
  date: Date;
  echeance: Date;
  total_general: Number;
  statut: string;
  reference: string;
  tva: number;
  totalHTV: number;
  avance: number;
  reste: number;
  modepaiement: string;
  numero: string;
  numeroDossier: string;
  datejugement: string;
  huissierjustice: string;
  articles: {
    produit: mongoose.Schema.Types.ObjectId;
    quantite: Number;
  }[];
  banque: string;
  admin: mongoose.Schema.Types.ObjectId;
  montantimpaye: number;
}

const factureSchema = new Schema<IFacture>(
  {
    reference: {
      type: String,
      required: true,
    },
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
    echeance: {
      type: Date,
      default: Date.now,
      required: false,
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
    montantimpaye: {
      type: Number,
      required: false,
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
    numeroDossier: {
      type: String,
      required: false,
    },
    huissierjustice: {
      type: String,
      required: false,
    },
    datejugement: {
      type: String,
      required: false,
    },
    statut: {
      type: String,
      enum: [
        "pending",
        "paid",
        "cancelled",
        "semi-paid",
        "not-paid",
        "pendingecheance",
      ],
      default: "pending",
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    banque: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Create and export the model
const Facture: Model<IFacture> = model<IFacture>("facture", factureSchema);
export default Facture;
