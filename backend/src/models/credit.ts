import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface ICredit extends Document {
  banque: mongoose.Schema.Types.ObjectId;
  type: string;
  echeance: Date;
  principal: number;
  interet: number;
  total: number;
  encours: number;
  etat: string;
  admin: mongoose.Schema.Types.ObjectId;
}

const creditSchema = new Schema<ICredit>(
  {
    banque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "banque",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    echeance: {
      type: Date,
      required: false,
    },
    principal: {
      type: Number,
      required: true,
    },
    interet: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    encours: {
      type: Number,
      required: true,
    },
    etat: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the model
const Credit: Model<ICredit> = model<ICredit>("credit", creditSchema);
export default Credit;
