import mongoose from "mongoose";

const bonSchema = new mongoose.Schema({
  BonDate: {
    type: Date,
    required: true,
    default: Date.now,
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
});

const Bon = mongoose.model("Bon", bonSchema);

export default Bon;
