import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middleweare/authMiddleweare.js";

const router = express.Router();

router.get("/", authMiddleware, getAllProducts); // Fetch all products
router.post("/", authMiddleware, createProduct); // Create a product
router.put("/:id", authMiddleware, updateProduct); // Update a product
router.delete("/:id", authMiddleware, deleteProduct); // Delete a product

export default router;
