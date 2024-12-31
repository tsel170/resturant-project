import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
    default: "676d0974ccb270069df3e06f",
  },
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
  tip: {
    type: Number,
    default: 0,
  },
});

const Shift = mongoose.model("Shift", shiftSchema);

export default Shift;
