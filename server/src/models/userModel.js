import mongoose from "mongoose"
import bcrypt from "bcrypt"
const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  role: {
    type: String,
    required: true,
    enum: ["employee", "manager", "admin"],
  },
  jobTitle: {
    type: String,
    enum: ["waiter", "barista", "chef", ""],
    required: function () {
      return this.role === "employee"
    },
    shifts: [
      {
        shift: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shift",
          required: false,
        },
        tip: {
          type: Number,
          required: false,
        },
      },
    ],
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: "676d0974ccb270069df3e06f",
    },
  },
  bons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bon",
      required: false,
    },
  ],
  totalSpent: { type: Number, default: 0 },
})

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

export default mongoose.model("User", userschema)
