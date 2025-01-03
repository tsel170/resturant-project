import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timeShift: {
    type: String,
    required: true,
    enum: ["am", "pm"],
  },
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      startShift: {
        type: Date,
        default: null,
      },
      endShift: {
        type: Date,
        default: null,
      },
      table: {
        type: [Number],
        required: false,
      },
      tip: {
        type: Number,
        default: 0,
      },
      required: false,
    },
  ],
  meals: [
    {
      meal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
        required: false,
      },
      title: {
        type: String,
        required: false,
      },
    },
  ],
});

const Shift = mongoose.model("Shift", shiftSchema);

export default Shift;
