import Bon from "../models/bonModel.js";
import User from "../models/userModel.js";
import Branch from "../models/branchModel.js";
import Meal from "../models/mealModel.js";

export const addBon = async (req, res) => {
  try {
    const { branch, user, meals, tableNumber, mealTitle } = req.body;
    const newBon = await Bon.create(req.body);

    const newMeals = await Meal.find({
      _id: { $in: meals.map((meal) => meal.meal) },
    });

    const newMealsWithTitle = newMeals.map((meal) => ({
      ...meal,
      mealTitle: mealTitle,
    }));

    if (!newMeals) {
      return res.status(404).json({ message: "Meals not found" });
    }

    await Branch.findByIdAndUpdate(branch, {
      $push: { bons: newBon._id },
    });

    await User.findByIdAndUpdate(user, {
      $push: { bons: newBon._id },
    });

    res.status(201).json({
      success: true,
      bonNumber: newBon.bonNumber,
      bon: newBon,
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
