import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import indexRouter from "./routers/indexRouter.js";
import connectDB from "./configDb/db.js";
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();

app.use(cors());

app.use(cookieParser());

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Test route to verify server is running
app.get('/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ message: 'Server is running!' });
});

connectDB();

app.use("/api", indexRouter);

export default app;
