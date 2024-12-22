import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",


  },
  mealArray: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
        required: true,
        uniqe: true,
      },
    ],
  },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
