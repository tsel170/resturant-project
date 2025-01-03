import Bon from "../models/bonModel.js";
import Meal from "../models/mealModel.js";
import User from "../models/userModel.js";
import Branch from "../models/branchModel.js";
import Shift from "../models/shiftModel.js";


export const addBon = async (req, res) => {
  const { branch, meals, user, tableNumber, mealTitle, shiftId } = req.body;

  if (!meals || !user || !tableNumber || !branch || !shiftId) {
    return res.status(400).json({ message: "Missing required fields" });

  }

  try {
    const newBon = await Bon.create(req.body)


    const newMeals = await Meal.find({
      _id: { $in: meals.map((meal) => meal.meal) },
    })


    const mealsForShift = meals.map(meal => ({
      meal: meal.meal,
      title: mealTitle
    }));


    if (!newMeals) {
      return res.status(404).json({ message: "Meals not found" })
    }

    await Branch.findByIdAndUpdate(branch, {
      $push: { bons: newBon._id },
    })

    await User.findByIdAndUpdate(user, {
      $push: { bons: newBon._id },
    })

    const shift = await Shift.findById(shiftId);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    await Shift.findByIdAndUpdate(shiftId, {
      $push: { meals: { $each: mealsForShift } },
    })

    res.status(201).json({
      success: true,
      bonNumber: newBon.bonNumber,

      bon: newBon,
      message: "Bon created successfully",
    })
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
    const Bon = await Bon.findById(req.params.id)
    res.status(200).json(Bon)
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get Bon",
      error: err.message,
    });
  }
};

export const updateBon = async (req, res) => {
  const { branch, user } = req.body;
  try {
    const updatedBon = await Bon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!Bon) {
      return res.status(404).json({ message: "Bon not found" });
    }

    res.status(200).json({ message: "Bon updated successfully" })

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
    const deletedBon = await Bon.findByIdAndDelete(req.params.id)

    if (!deletedBon) {
      return res.status(404).json({
        success: false,
        message: "Bon not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Bon deleted successfully",
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Bon",
      error: err.message,
    });
  }
};

export const updateDeliveredBon = async (req, res) => {
  const { id } = req.params;
  try {
    const bon = await Bon.findById(id);
    if (!bon) {
      return res.status(404).json({ message: "Bon not found" });
    }

    bon.delivered = true;
    await bon.save();

    await User.findOneAndUpdate(
      { "bons.bon": id },
      {
        $set: {
          "bons.$.delivered": true,
        },
      }
    );

    await Branch.findOneAndUpdate(
      { "bons.bon": id },
      {
        $set: {
          "bons.$.delivered": true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Bon delivery status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update bon delivery status",
      error: error.message,
    });
  }
};

export const updateReadyBon = async (req, res) => {
  const { id } = req.params;
  try {
    const bon = await Bon.findById(id);
    bon.ready = true;
    await bon.save();

    await User.findOneAndUpdate(
      { "bons.bon": id },
      {
        $set: {
          "bons.$.ready": true,
        },
      }
    );

    await Branch.findOneAndUpdate(
      { "bons.bon": id },
      {
        $set: {
          "bons.$.ready": true,
        },
      }
    );
    res.status(200).json({ message: "Bon updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update bon", error: error.message });
  }
};

export const updatePaidBon = async (req, res) => {
  const { id } = req.params;
  try {
    const bon = await Bon.findById(id);
    bon.paid = true;
    await bon.save();

    await User.findOneAndUpdate(
      { "bons.bon": id },
      {
        $set: {
          "bons.$.paid": true,
        },
      }
    );

    await Branch.findOneAndUpdate(
      { "bons.bon": id },
      {
        $set: {
          "bons.$.paid": true,
        },
      }
    );
    res.status(200).json({ message: "Bon updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update bon", error: error.message });
  }
};
