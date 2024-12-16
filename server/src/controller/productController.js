import express from "express";
import Product from "../models/productModel.js";

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      creator: req._id,
    });
    res.status(201).json({
      success: true,
      product,
      message: "Product created successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create product",
      error: err.message,
    });
  }
};
