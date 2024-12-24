import mongoose from "mongoose"

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
      },
      seats: {
        type: Number,
        required: true,
      },
      required: false,
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

        required: true,
      },
      jobTitle: {
        type: String,
        enum: ["waiter", "chef", "barista"],
        required: function () {
          return this.role === "employee"
        },
      },

      required: false,
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
      required: false,
    },
  ],
})

const Branch = mongoose.model("Branch", branchSchema)

export default Branch
