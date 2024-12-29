import Bon from "../models/bonModel.js"
import Meal from "../models/mealModel.js"
import User from "../models/userModel.js"
import Branch from "../models/branchModel.js"

export const addBon = async (req, res) => {
  const { meals, user, tableNumber, branch } = req.body

  if (!meals || !user || !tableNumber || !branch) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  try {
    for (const mealEntry of meals) {
      const meal = await Meal.findById(mealEntry.meal)
      if (!meal) {
        return res
          .status(400)
          .json({ message: `Invalid meal id: ${mealEntry.meal}` })
      }
    }
    const userExists = await User.findById(user)
    if (!userExists) {
      return res.status(400).json({ message: "Invalid user id" })
    }

    const newBon = await Bon.create(req.body) // החלפתי את שם המשתנה ל-newBon
    res.status(201).json({
      success: true,
      Bon: newBon,
      message: "Bon created successfully",
    })

    const branchBon = await Branch.findByIdAndUpdate(
      branch,
      { $push: { bons: newBon._id } },
      { new: true }
    )
    if (!branchBon) {
      return res.status(400).json({ message: "Invalid branch id" })
    }

    const userBon = await User.findByIdAndUpdate(
      user,
      { $push: { bons: newBon._id } },
      { new: true }
    )
    if (!userBon) {
      return res.status(400).json({ message: "Invalid user id" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "An error occurred", error: error.message })
  }
}

export const getAllBons = async (req, res) => {
  try {
    const Bons = await Bon.find()
    res.status(200).json({
      success: true,
      Bons,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get Bons",
      error: err.message,
    })
  }
}

export const deleteBon = async (req, res) => {
  try {
    const Bon = await Bon.findByIdAndDelete(req.params.id)
    if (!Bon) {
      return res.status(404).json({ message: "Bon not found" })
    }
    res.status(200).json({ message: "Bon deleted successfully" })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Bon",
      error: err.message,
    })
  }
}

export const updateBon = async (req, res) => {
  try {
    const Bon = await Bon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!Bon) {
      return res.status(404).json({ message: "Bon not found" })
    }
    res.status(200).json({ message: "Bon updated successfully" })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update Bon",
      error: err.message,
    })
  }
}

export const getSingleBon = async (req, res) => {
  try {
    const Bon = await Bon.findById(req.params.id)
    res.status(200).json(Bon)
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get Bon",
      error: err.message,
    })
  }
}
