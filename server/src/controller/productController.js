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

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ creator: req._id });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: err.message,
    });
  }
};
