import Bon from "../models/bonModel.js";
import Meal from "../models/mealModel.js";
import User from "../models/userModel.js";
import Branch from "../models/branchModel.js";

export const addBon = async (req, res) => {
  const { meals, user, tableNumber, branch } = req.body;

  if (!meals || !user || !tableNumber || !branch) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let totalAmount = 0;
    for (const mealEntry of meals) {
      const meal = await Meal.findById(mealEntry.meal);
      if (!meal) {
        return res
          .status(400)
          .json({ message: `Invalid meal id: ${mealEntry.meal}` });
      }
      totalAmount += meal.price * mealEntry.quantity;
    }

    const newBon = await Bon.create({
      ...req.body,
      totalAmount,
      date: new Date(),
    });

    await Promise.all([
      Branch.findByIdAndUpdate(
        branch,
        { $push: { bons: newBon._id } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        user,
        {
          $push: { bons: newBon._id },
          $inc: { totalSpent: totalAmount },
        },
        { new: true }
      ),
    ]);

    res.status(201).json({
      success: true,
      bon: newBon,
      message: "Bon created successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
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

export const updateBon = async (req, res) => {
  try {
    const updatedBon = await Bon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBon) {
      return res.status(404).json({ message: "Bon not found" });
    }

    res.status(200).json({
      success: true,
      message: "Bon updated successfully",
      bon: updatedBon,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update Bon",
      error: err.message,
    });
  }
};

export const deleteBon = async (req, res) => {
  try {
    const deletedBon = await Bon.findByIdAndDelete(req.params.id);

    if (!deletedBon) {
      return res.status(404).json({
        success: false,
        message: "Bon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bon deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Bon",
      error: err.message,
    });
  }
};
