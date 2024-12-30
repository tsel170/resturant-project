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
  number: {
    type: Number,
    required: true,
  },
  ready: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: false,
  },

  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  bonNumber: {
    type: Number,
    required: true,
    unique: true,
  },
});


const Bon = mongoose.model("Bon", bonSchema)

export default Bon
