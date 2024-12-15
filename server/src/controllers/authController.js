import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { email, password, cityId } = req.body;

  try {
    const user = await User.create({ email, password, cityId });
    console.log(user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error.message);

    res
      .status(400)
      .json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
