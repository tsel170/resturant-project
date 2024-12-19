import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  tables: [
    {
      tableNumber: {
        type: Number,
        required: true,
        unique: true,
      },
      seats: {
        type: Number,
        required: true,
      },
    },
  ],
  employees: [
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["waiter", "chef", "barista"],
        required: true,
      },
    },
  ],
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
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
