import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  manager: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
  tables: [
    {
      tableNumber: {
        type: Number,
        required: true,

        unique: false,
      },
      seats: {
        type: Number,
        required: true,
      },
      occuipied: {
        type: Boolean,
        default: false,
      },
    },
  ],
  employees: [
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      jobTitle: {
        type: String,
        enum: ["waiter", "chef", "barista"],
        required: function () {
          return this.role === "employee";
        },
      },
    },
  ],
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: false,
  },
  orders: [
    {
      bon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bon",
        required: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
