import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface IProduit extends Document {
  name: string;
  description: string;
  price: number;
  stock:number;
  admin: mongoose.Schema.Types.ObjectId;
}

const produitSchema = new Schema<IProduit>(
  {
    name: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
  },
  price: {
      type: Number,
      required: true
  },
  stock: {
      type: Number,
      default: 0
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required: true
 },
  },
  { timestamps: true }
);

// Create and export the model
const produit: Model<IProduit> = model<IProduit>("produit", produitSchema);
export default produit;
