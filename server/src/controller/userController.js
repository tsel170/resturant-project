import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../sercret/env.js"
import Branch from "../models/branchModel.js"

export const register = async (req, res) => {
  const { name, email, password, phone, gender, role, jobTitle } = req.body
  if (!name || !email || !password || !phone || !gender || !role) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    })
  }
  if (role === "employee" && !jobTitle) {
    return res.status(400).json({
      success: false,
      message: "Job title is required for employees",
    })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      })
    }
    const user = await User.create(req.body)

    res.status(201).json({
      success: true,
      user,
      message: "User created successfully",
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
      branch: user.branch,
      jobTitle: user.jobTitle,
    }
    console.log(userData)

    res.status(200).json({
      success: true,
      message: "Login successful",
      userData,
      token,
    })
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({
      success: true,
      users,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: err.message,
    })
  }
}

export const updateUser = async (req, res) => {
  const { token, branch } = req.body
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (branch) {
      const branchToUpdate = await Branch.findById(branch)
      if (branchToUpdate) {
        if (
          user.role === "manager" &&
          !branchToUpdate.manager.includes(user._id)
        ) {
          branchToUpdate.manager.push(user._id)
        }

        if (user.role === "employee" && user.jobTitle) {
          const existingEmployee = branchToUpdate.employees.find(
            (emp) => emp.employee.toString() === user._id.toString()
          )
          if (!existingEmployee) {
            branchToUpdate.employees.push({
              employee: user._id,
              role: user.jobTitle,
            })
          }
        }
        await branchToUpdate.save()
      }
    }

    res.status(200).json({
      success: true,
      user,
      token,
      message: "User updated successfully",
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: err.message,
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user.branch) {
      const branchToUpdate = await Branch.findById(user.branch)

      if (branchToUpdate) {
        if (user.role === "manager") {
          branchToUpdate.manager = branchToUpdate.manager.filter(
            (manager) => manager.toString() !== user._id.toString()
          )
        }

        if (user.role === "employee") {
          branchToUpdate.employees = branchToUpdate.employees.filter(
            (employee) => employee.employee.toString() !== user._id.toString()
          )
        }

        await branchToUpdate.save()
      }
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: err.message,
    })
  }
}
