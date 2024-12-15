import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, phone, city, age, gender, role } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
      phone,
      city,
      age,
      gender,
      role,
    });

    if (!name || !email || !password || !phone || !age || !gender || !role) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

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
      expiresIn: "1d",
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
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
