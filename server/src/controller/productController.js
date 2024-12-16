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


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: err.message,
    });
  }
};

