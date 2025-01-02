import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
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
    required: false,
  },
  category: {
    type: String,
    required: true,
    // enum: [
    //   "breakfast",
    //   "lunch",
    //   "dinner",
    //   "desert",
    //   "starter",
    //   "main",
    //   "drink",
    //   "other",
    // ],
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
      required: false,
    },
  ],
  recipe: {
    type: String,
    required: false,
    default: "emprovise",
  },
  theDishPreparer: {
    type: String,
    // required: true,
    enum: ["chef", "waiter", "barista"],
    default: "chef",
  },
});

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
