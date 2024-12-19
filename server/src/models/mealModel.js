import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  Ingredients: [
    {
      ingredient: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
  theDishPreparer: {
    type: String,
    required: true,
    enum: ["chef", "waiter", "barista"],
  },
});

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
