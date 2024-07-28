import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface IFournisseur extends Document {
  fullName: string;
  email: string;
  phone: number;
  address: string;
  matriculeFiscale: string;
  admin: mongoose.Schema.Types.ObjectId;
}

const fournisseurSchema = new Schema<IFournisseur>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    matriculeFiscale: {
      type: String,
      required: true,
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
const Fournisseur: Model<IFournisseur> = model<IFournisseur>("fournisseur", fournisseurSchema);
export default Fournisseur;
