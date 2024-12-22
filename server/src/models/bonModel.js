import mongoose from "mongoose";

const bonSchema = new mongoose.Schema({
  bonNumber: {
    type: String,
    required: true,
    unique: true,
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
        require: false,
      },
    },
  ],
  orderType: {
    type: String,
    enum: ["dine-in", "takeaway"],
    required: true,
  },
  tableNumber: {
    type: Number,
    required: function () {
      return this.orderType === "dine-in";
    },
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ready: {
    type: Boolean,
    default: false,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

const Bon = mongoose.model("Bon", bonSchema);

export default Bon;
