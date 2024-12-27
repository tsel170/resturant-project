import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  Date: {
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
});

const Shift = mongoose.model("Shift", shiftSchema);

export default Shift;
