import mongoose from "mongoose"

const bonSchema = new mongoose.Schema({
  bonNumber: {
    type: String,
    unique: true,
    default: function () {
      const now = new Date();
      return `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`.replace(
        /:/g,
        ""
      );
    },
    trim: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  meals: [
    {
      meal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
        required: true,
      },
      mealTitle: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      note: {
        type: String,
        maxlength: 500,
        required: false,
      },
    },
  ],
  tableNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  delivered: {
    type: Boolean,
    default: false,

  },
  ready: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: false,
  },

  date: { type: Date, default: Date.now },
});


const Bon = mongoose.model("Bon", bonSchema)

export default Bon
