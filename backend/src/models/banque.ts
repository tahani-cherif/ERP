import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface IBanque extends Document {
  banque: string;
  rib: string;
  iban: string;
  swift: string;
  admin: mongoose.Schema.Types.ObjectId;
}

const banqueSchema = new Schema<IBanque>(
  {

    banque: {
      type: String,
      required: true,
    },
    rib: {
      type: String,
      required: true,
    },
    iban: {
      type: String,
      required:false,
    },
    swift: {
      type: String,
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
const Banque: Model<IBanque> = model<IBanque>("banque", banqueSchema);
export default Banque;
