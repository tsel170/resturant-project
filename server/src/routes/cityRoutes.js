import express from "express";
import { getAllCities, createCity } from "../controllers/cityController.js";
import authMiddleware from "../middleweare/authMiddleweare.js";

const router = express.Router();

router.get("/", getAllCities); // Fetch all cities
router.post("/", authMiddleware, createCity); // Create a city

export default router;
