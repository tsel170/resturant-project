import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Branch from "../models/branchModel.js";
import Shift from "../models/shiftModel.js";

export const register = async (req, res) => {
  const { name, email, password, phone, gender, role, jobTitle } = req.body;
  if (!name || !email || !password || !phone || !gender || !role) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  if (role === "employee" && !jobTitle) {
    return res.status(400).json({
      success: false,
      message: "Job title is required for employees",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      user,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    });
  }
};

export const getUser = async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userData = {
      ...user._doc
    };
    console.log(userData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      userData,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // const users = await User.find();
    const users = await User.find({}, "_id name email phone role jobTitle tipsTotal");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { token, branch } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (branch) {
      const branchToUpdate = await Branch.findById(branch);
      if (branchToUpdate) {
        if (
          user.role === "manager" &&
          !branchToUpdate.manager.includes(user._id)
        ) {
          branchToUpdate.manager.push(user._id);
        }

        if (user.role === "employee" && user.jobTitle) {
          const existingEmployee = branchToUpdate.employees.find(
            (emp) => emp.employee.toString() === user._id.toString()
          );
          if (!existingEmployee) {
            branchToUpdate.employees.push({
              employee: user._id,
              role: user.jobTitle,
            });
          }
        }
        await branchToUpdate.save();
      }
    }

    res.status(200).json({
      success: true,
      user,
      token,
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user.branch) {
      const branchToUpdate = await Branch.findById(user.branch);

      if (branchToUpdate) {
        if (user.role === "manager") {
          branchToUpdate.manager = branchToUpdate.manager.filter(
            (manager) => manager.toString() !== user._id.toString()
          );
        }

        if (user.role === "employee") {
          branchToUpdate.employees = branchToUpdate.employees.filter(
            (employee) => employee.employee.toString() !== user._id.toString()
          );
        }

        await branchToUpdate.save();
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: err.message,
    });
  }
};

export const toggleShift = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }
    console.log("user", user)
    const currentDate = new Date();

    // If currently in shift and turning it off, calculate duration
    if (user.enteredShift) {
      const shiftStart = new Date(user.enteredShiftDate);
      const diffMs = currentDate - shiftStart;

      // Convert milliseconds to hours and minutes
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      // Update last shift duration
      user.lastShiftDuration = { hours, minutes };

      // Update total worked time this month
      user.workedThisMonth.hours += hours;
      user.workedThisMonth.minutes += minutes;

      // Adjust if minutes exceed 60
      if (user.workedThisMonth.minutes >= 60) {
        user.workedThisMonth.hours += Math.floor(user.workedThisMonth.minutes / 60);
        user.workedThisMonth.minutes = user.workedThisMonth.minutes % 60;
      }
      // res.status(200).json({
      //   success: true,
      //   user,
      // });
    }

    // Toggle the shift status
    user.enteredShift = !user.enteredShift;

    if (user.enteredShift) {
      // Starting a new shift
      const newShift = {
        shift: user._id,
        date: currentDate,
        timeShift: currentDate.getHours() < 12 ? "am" : "pm",
        table: req.body.tables || []
      };

      user.shifts = user.shifts.filter(shift =>
        shift.shift && shift.date && shift.timeShift
      );
      user.shifts.push(newShift);
      user.enteredShiftDate = currentDate;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: `Shift ${user.enteredShift ? 'started' : 'ended'} successfully`,
      user: user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLastShiftDuration = async (req, res) => {
  try {
    const { hours, minutes } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update last shift duration
    user.lastShiftDuration = { hours, minutes };

    // Update total worked time this month
    user.workedThisMonth.hours += hours;
    user.workedThisMonth.minutes += minutes;

    // Adjust if minutes exceed 60
    if (user.workedThisMonth.minutes >= 60) {
      user.workedThisMonth.hours += Math.floor(user.workedThisMonth.minutes / 60);
      user.workedThisMonth.minutes = user.workedThisMonth.minutes % 60;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Shift duration updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTips = async (req, res) => {
  try {
    const { tipsAmount } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.tipsLastShift = tipsAmount;
    user.tipsTotal += tipsAmount;

    await user.save();
    res.status(200).json({
      success: true,
      message: "Tips updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

