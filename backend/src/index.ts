import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { notFoundError, errorHundler } from "./middlewares/error-handler";
import { router as userRoutes } from "./routes/user";
import { router as authRoutes } from "./routes/auth";
import { router as clientsRoutes } from "./routes/client";
import { router as fournisseursRoutes } from "./routes/fornisseur";
import { router as produitRoutes } from "./routes/produit";
import { router as factureRoutes } from "./routes/facture";

dotenv.config({ path: ".env" });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app: Application = express();

const port: string | undefined = process.env.PORT;
const databaseName: string = "km";

mongoose
  .connect(`${process.env.DB_URL}/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(morgan(process.env.NODE_ENV || "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/fournisseurs", fournisseursRoutes);
app.use("/api/produits", produitRoutes);
app.use("/api/facture", factureRoutes);

app.use(notFoundError);
app.use(errorHundler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
