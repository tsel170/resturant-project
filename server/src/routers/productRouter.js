import express from "express";
import {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "../controller/productController.js";
import authMidlleware from "../middleware/authMiddleware.js";

const Router = express.Router();

Router.post("/addProduct", authMidlleware, addProduct);
Router.get("/products", getAllProducts);
Router.delete("/deleteProduct/:id", deleteProduct);
Router.put("/updateProduct/:id", updateProduct);

export default Router;
