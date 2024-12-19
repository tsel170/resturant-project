import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../sercret/env.js";

export const register = async (req, res) => {
  const { name, email, password, phone, gender, role, jobTitle } = req.body;
  try {
    const user = await User.create(req.body);

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !gender ||
      !role
      // (role === "employee" && !jobTitle)
    ) {
      console.log("Missing required fields");
      // return res.status(400).json({ message: "Missing required fields" });
    }
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
      expiresIn: "30d",
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
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

export const updateUser = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
