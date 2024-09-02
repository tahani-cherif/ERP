import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface IProduit extends Document {
  reference: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  admin: mongoose.Schema.Types.ObjectId;
  type: string;
  historique: {
    type: string;
    date: Date;
    quantite: number;
  };
}
const historiqueSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  date: {
    type: Date,
  },
  quantite: {
    type: Number,
  },
});

const produitSchema = new Schema<IProduit>(
  {
    name: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    historique: {
      type: [historiqueSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Create and export the model
const produit: Model<IProduit> = model<IProduit>("produit", produitSchema);
export default produit;
