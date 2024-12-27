import Shift from "../models/shiftModel";
import User from "../models/userModel";

export const addShift = async (req, res) => {
  const { Date, timeShift, users } = req.body;
  if (!Date || !timeShift) {
    return res.status(400).json({ error: "Date and timeShift are required" });
  }
  if (Date < new Date()) {
    return res.status(400).json({ error: "We are not sopporting time travel" });
  }
  try {
    const shift = await Shift.create(req.body);
    if (users) {
      users.forEach(async (userId) => {
        await users.findByIdAndUpdate(userId, {
          $push: { shifts: shift._id },
        });
      });
    }
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editShift = async (req, res) => {
  try {
    const { id } = req.params;
    const shift = await Shift.findByIdAndUpdate(id, req.body, { new: true });
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteShift = async (req, res) => {
  const {u}
  try {
    const { id } = req.params;
    const shift = await Shift.findByIdAndDelete(id);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
