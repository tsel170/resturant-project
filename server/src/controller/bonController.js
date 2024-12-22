import Bon from "../models/bonModel.js";

export const addBon = async (req, res) => {
  try {
    const Bon = await Bon.create(req.body);
    res.status(201).json({
      success: true,
      Bon,
      message: "Bon created successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create Bon",
      error: err.message,
    });
  }
};

export const getAllBons = async (req, res) => {
  try {
    const Bons = await Bon.find();
    res.status(200).json({
      success: true,
      Bons,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get Bons",
      error: err.message,
    });
  }
};

export const deleteBon = async (req, res) => {
  try {
    const Bon = await Bon.findByIdAndDelete(req.params.id);
    if (!Bon) {
      return res.status(404).json({ message: "Bon not found" });
    }
    res.status(200).json({ message: "Bon deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Bon",
      error: err.message,
    });
  }
};

export const updateBon = async (req, res) => {
  try {
    const Bon = await Bon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!Bon) {
      return res.status(404).json({ message: "Bon not found" });
    }
    res.status(200).json({ message: "Bon updated successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update Bon",
      error: err.message,
    });
  }
};

export const getSingleBon = async (req, res) => {
  try {
    const Bon = await Bon.findById(req.params.id);
    res.status(200).json(Bon);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get Bon",
      error: err.message,
    });
  }
};
