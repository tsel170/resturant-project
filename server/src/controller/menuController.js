import Menu from "../models/menuModel.js";

export const getAllMenus = async (req, res) => {
  try {
    const Menus = await Menu.find();
    res.status(200).json({
      success: true,
      Menus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get Menus",
      error: err.message,
    });
  }
};

export const addMenu = async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json({
      success: true,
      menu,
      message: "Menu created successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create Menu",
      error: err.message,
    });
  }
};

export const dealteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Menu",
      error: err.message,
    });
  }
};

export const changeMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      menu,
      message: "Menu updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update Menu",
      error: err.message,
    });
  }
};
