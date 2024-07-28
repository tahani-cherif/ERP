import mongoose, { Document, Model } from "mongoose";

const { Schema, model } = mongoose;
interface IClient extends Document {
  fullName: string;
  email: string;
  phone: number;
  address: string;
  matriculeFiscale: string;
  admin: mongoose.Schema.Types.ObjectId;
}

const clientSchema = new Schema<IClient>(
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
const Client: Model<IClient> = model<IClient>("client", clientSchema);
export default Client;
