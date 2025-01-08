import Bon from "../models/bonModel.js";
import Meal from "../models/mealModel.js";
import User from "../models/userModel.js";
import Branch from "../models/branchModel.js";


export const addBon = async (req, res) => {

  const { branch, meals, user, tableNumber, mealTitle, note } = req.body;

  if (!meals || !user || !tableNumber || !branch) {

    return res.status(400).json({ message: "Missing required fields" });
  }


  try {
    const newMeals = await Meal.find({
      _id: { $in: meals.map((meal) => meal.meal) }
    }).lean();

    if (!newMeals || newMeals.length === 0) {
      return res.status(404).json({ message: "Meals not found" });
    }

    const bonData = {
      ...req.body,
      meals: newMeals.map(meal => ({
        meal: meal._id,
        mealTitle: meal.title,
        quantity: meals.find(m => m.meal.toString() === meal._id.toString())?.quantity || 1,
        note: meals.find(m => m.meal.toString() === meal._id.toString())?.note || ""
      }))
    };
    

    const newBon = await Bon.create(bonData);
    

    await Branch.findByIdAndUpdate(branch, {
      $push: { 
        bons: {
          bon: newBon._id,
          delivered: false,
          ready: false,
          paid: false
        }
      },
    });

    await User.findByIdAndUpdate(user, {
      $push: { 
        bons: {
          bon: newBon._id,
          delivered: false,
          ready: false,
          paid: false
        }
      },
    });

    res.status(201).json({
      success: true,
      newBon,
      meals: newMeals,
      message: "Bon created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const getAllBons = async (req, res) => {
  try {
    const bons = await Bon.find()
      .populate('meals.meal')
      .populate('branch')
      .populate('user')
      .lean();
    
    
    
    res.status(200).json({
      success: true,
      count: bons.length,
      bons,
    });
  } catch (err) {
    console.error('Error in getAllBons:', err);
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
  try {
    const { bonNumber } = req.body;
    console.log("Searching for bon with number:", bonNumber);

    // Log all bons to see what we have
    const allBons = await Bon.find({});
    console.log("All bons in database:", allBons.map(bon => ({
      id: bon._id,
      bonNumber: bon.bonNumber,
      paid: bon.paid
    })));

    const bon = await Bon.findOne({ bonNumber: bonNumber });
    console.log("Found bon:", bon);

    if (!bon) {
      return res.status(404).json({ 
        message: "Bon not found", 
        searchedBonNumber: bonNumber,
        availableBonNumbers: allBons.map(b => b.bonNumber)
      });
    }

    bon.paid = true;
    await bon.save();

    await User.findOneAndUpdate(
      { "bons.bon": bon._id },
      {
        $set: {
          "bons.$.paid": true,
        },
      }
    );

    await Branch.findOneAndUpdate(
      { "bons.bon": bon._id },
      {
        $set: {
          "bons.$.paid": true,
        },
      }
    );
    res.status(200).json({ message: "Bon updated successfully" });
  } catch (error) {
    console.error("Error in updatePaidBon:", error);
    res.status(500).json({ 
      message: "Failed to update bon", 
      error: error.message,
      stack: error.stack 
    });
  }
};
