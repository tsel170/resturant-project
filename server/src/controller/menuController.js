import Menu from "../models/menuModel.js";
import Branch from "../models/branchModel.js";

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
    const { branch, mealArray } = req.body;

    const menu = await Menu.create({ branch, mealArray });

    const updatedBranch = await Branch.findByIdAndUpdate(
      branch,
      { menu: menu._id },
      { new: true }
    );

    if (!updatedBranch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    res.status(201).json({
      success: true,
      menu,
      message: "Menu created successfully and branch updated",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create Menu",
      error: err.message,
    });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      menu.branch,
      { menu: null },
      { new: true }
    );

    if (!updatedBranch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found for the deleted menu",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu deleted successfully and branch updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Menu",
      error: err.message,
    });
  }
};

export const updateMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    if (updatedMenu.branch) {
      await Branch.findByIdAndUpdate(updatedMenu.branch, {
        menu: updatedMenu._id,
      });
    }

    res.status(200).json({
      success: true,
      menu: updatedMenu,
      message: "Menu updated successfully and branch synchronized",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update menu",
      error: err.message,
    });
  }
};

export const addMealToMenu = async (req, res) => {
  const { mealId } = req.body;

  try {
    const menu = await Menu.findById(req.params.id).populate("branch");
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    const mealExists = menu.mealArray.includes(mealId);
    if (mealExists) {
      return res.status(400).json({
        success: false,
        message: "Meal already exists in the menu",
      });
    }

    menu.mealArray.push(mealId);
    await menu.save();

    const branch = await Branch.findById(menu.branch);
    if (branch) {
      branch.menu = menu._id;
      await branch.save();
    }

    res.status(200).json({
      success: true,
      menu,
      message: "Meal added to menu successfully and branch updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add meal to menu",
      error: err.message,
    });
  }
};
