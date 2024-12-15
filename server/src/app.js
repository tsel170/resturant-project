import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import indexRouter from "./routers/indexRouter.js";
import connectDB from "./configDb/db.js";
import User from "./models/userModel.js";
const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

connectDB();

app.use("/api", indexRouter);

export default app;
