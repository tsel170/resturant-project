import Meal from "../models/mealModel.js";

export const addMeal = async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(201).json({
      success: true,
      meal,
      message: "Meal created successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create Meal",
      error: err.message,
    });
  }
};

export const getAllMeals = async (req, res) => {
  try {
    const Meals = await Meal.find();
    res.status(200).json({
      success: true,
      Meals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get Meals",
      error: err.message,
    });
  }
};

export const getSingleMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    res.status(200).json({
      success: true,
      meal,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get Meal",
      error: err.message,
    });
  }
};

export const updateMeal = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Meal id is required",
    });
  }
  try {
    const meal = await Meal.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    res.status(200).json({
      success: true,
      meal,
      message: "Meal updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update Meal",
      error: err.message,
    });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Meal",
      error: err.message,
    });
  }
};
