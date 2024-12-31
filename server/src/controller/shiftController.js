import Shift from "../models/shiftModel.js";
import User from "../models/userModel.js";
import Branch from "../models/branchModel.js";
export const addShift = async (req, res) => {
  const { date, timeShift, users, branchId } = req.body;
  if (!date || !timeShift || !branchId) {
    return res
      .status(400)
      .json({ error: "Date, timeShift and branchId are required" });
  }
  if (date < new Date()) {
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
        {
          $push: {
            shifts: { shift: shift._id, date: date, timeShift: timeShift },
          },
        }
      );
    }

    await Branch.findByIdAndUpdate(branchId, {
      $push: {
        shifts: { shift: shift._id, date: date, timeShift: timeShift },
      },
    });

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

export const updateShift = async (req, res) => {
  const { id, branchId, userId } = req.params;
  const { date, timeShift } = req.body;
  try {
    const shift = await Shift.findByIdAndUpdate(
      id,
      { date, timeShift },
      { new: true }
    );

    if (userId.length > 0) {
      await User.findByIdAndUpdate(userId, {
        $set: { shifts: { shift: id, date: date, timeShift: timeShift } },
      });
    }

    if (branchId) {
      await Branch.findByIdAndUpdate(branchId, {
        $set: {
          shifts: { shift: id, date: date, timeShift: timeShift },
        },
      });
    }

    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteShift = async (req, res) => {
  const { id, branchId, userId } = req.params;
  try {
    const shift = await Shift.findByIdAndDelete(id);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    await Branch.findByIdAndUpdate(branchId, {
      $pull: { shifts: { shift: id } },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { shifts: { shift: id } },
    });
    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
