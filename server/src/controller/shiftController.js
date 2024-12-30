import Shift from "../models/shiftModel";
import User from "../models/userModel";
import Branch from "../models/branchModel";

export const addShift = async (req, res) => {
  const { Date, timeShift, users, branchId } = req.body;
  if (!Date || !timeShift || !branchId) {
    return res
      .status(400)
      .json({ error: "Date, timeShift and branchId are required" });
  }
  if (Date < new Date()) {
    return res.status(400).json({ error: "We are not supporting time travel" });
  }

  try {
    if (users && users.length > 0) {
      const existingUsers = await User.find({ _id: { $in: users } });
      if (existingUsers.length !== users.length) {
        return res
          .status(400)
          .json({ error: "One or more users do not exist" });
      }
    }

    const shift = await Shift.create(req.body);

    if (users && users.length > 0) {
      await User.updateMany(
        { _id: { $in: users } },
        { $push: { shifts: shift._id } }
      );
    }

    await Branch.findByIdAndUpdate(branchId, { $push: { shifts: shift._id } });

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
  const { id } = req.params;
  try {
    const shift = await Shift.findByIdAndDelete(id);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
