import express from "express";
import { addProduct } from "../controller/productController.js";
import authMidlleware from "../middleware/authMiddleware.js";

const Router = express.Router();

Router.post("/addProduct", authMidlleware, addProduct);

export default Router;
