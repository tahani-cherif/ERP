import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface IFacture extends Document {
  client:  mongoose.Schema.Types.ObjectId;
  fournisseur:  mongoose.Schema.Types.ObjectId;
  date: Date;
  total_general: Number;
  statut: string;
  tva:number;
  totalHTV:number;
  modepaiement:string;
  articles:  {
    produit: mongoose.Schema.Types.ObjectId,
    quantite: Number
}[]
}

const factureSchema = new Schema<IFacture>(
  {
  client: {
    type: mongoose.Schema.Types.ObjectId,
     ref:"client",
  },
  fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
     ref:"fournisseur"
  },
  date: {
      type: Date,
      default: Date.now,
      required: true
  },
  articles: [
      {
        produit: {
            type: mongoose.Schema.Types.ObjectId,
             ref:"produit",
          },
          quantite: {
              type: Number,
              required: true
          },
      }
  ],
  total_general: {
      type: Number,
      required: true
  },
  totalHTV: {
      type: Number,
      required: true
  },
  tva: {
      type: Number,
      required: true
  },
  modepaiement: {
      type: String,
      required: true
  },
  statut: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
      required: true
  }
  },
  { timestamps: true }
);

// Create and export the model
const Facture: Model<IFacture> = model<IFacture>("facture", factureSchema);
export default Facture;
