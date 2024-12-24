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
      status: {
        type: String,
        enum: ["occupied", "available"],
        default: "available",
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
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
