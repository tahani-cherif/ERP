import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface ICaisse extends Document {
  designation: string;
  encaissement: number;
  decaissement: number;
  date: Date;
  admin: mongoose.Schema.Types.ObjectId;
}

const creditSchema = new Schema<ICaisse>(
  {
    designation: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: false,
    },
    decaissement: {
      type: Number,
      required: true,
    },
    encaissement: {
      type: Number,
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
const Caisse: Model<ICaisse> = model<ICaisse>("caisse", creditSchema);
export default Caisse;
