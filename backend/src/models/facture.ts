import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface IFacture extends Document {
  numero: string;
  client:  mongoose.Schema.Types.ObjectId;
  date: Date;
  total_general: Number;
  statut: string;
  articles:  {
    description:  string,
    quantite:  Number,
    prix_unitaire: Number,
    total: Number
}[]
}

const factureSchema = new Schema<IFacture>(
  {
    numero: {
      type: String,
      required: true,
      unique: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
     ref:"client",
     required: true
  },
  date: {
      type: Date,
      default: Date.now,
      required: true
  },
  articles: [
      {
          description: {
              type: String,
              required: true
          },
          quantite: {
              type: Number,
              required: true
          },
          prix_unitaire: {
              type: Number,
              required: true
          },
          total: {
              type: Number,
              required: true
          }
      }
  ],
  total_general: {
      type: Number,
      required: true
  },
  statut: {
      type: String,
      // enum: ['en attente', 'payée', 'annulée'],
      // required: true
  }
  },
  { timestamps: true }
);

// Create and export the model
const Facture: Model<IFacture> = model<IFacture>("facture", factureSchema);
export default Facture;
