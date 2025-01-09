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
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    default: "676d0974ccb270069df3e06f",
  },
  avatar: {
    type: String,
    required: false,
  },
  enteredShift: {
    type: Boolean,
    default: false,
  },
  enteredShiftDate: {
    type: Date,
    required: false,
  },
  lastShiftDuration: {
    hours: {
      type: Number,
      default: 0
    },
    minutes: {
      type: Number,
      default: 0
    },
  },
  workedThisMonth: {
    hours: {
      type: Number,
      default: 0
    },
    minutes: {
      type: Number,
      default: 0
    }
  },
  tipsLastShift: {
    type: Number,
    default: 0
  },
  tipsTotal: {
    type: Number,
    default: 0
  },
  shifts: [
    {
      shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift",
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      timeShift: {
        type: String,
        enum: ["am", "pm"],
        required: true,
      },
      table: {
        type: [Number],
        required: false,
      },
    },
  ],
  bons: [
    {
      bon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bon",
        required: false,
      },
      delivered: {
        type: Boolean,
        default: false,
      },
      totalSpent: { type: Number, default: 0 },
    },
  ],
});


userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

export default mongoose.model("User", userschema)
