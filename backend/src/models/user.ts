import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;
interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  password: any;
  role: "user" | "admin";
  status: boolean;
  tokenPassword?: string;
  admin: mongoose.Schema.Types.ObjectId;
  acces: string[];
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    tokenPassword: {
      type: String,
      required: false,
    },
    acces: {
      type: [String], // Array of strings
      enum: [
        "home",
        "client",
        "fournisseur",
        "produit",
        "achat",
        "vente",
        "banque",
        "credit",
        "caisse",
        "juridique",
        "recouvrement",
        "deponse",
      ], // Restrict values to this set
      required: true, //
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
  },
  { timestamps: true }
);

// Middleware for hashing the password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Create and export the model
const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
