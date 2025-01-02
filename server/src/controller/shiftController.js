import Shift from "../models/shiftModel.js";
import User from "../models/userModel.js";

export const addShift = async (req, res) => {
  const { date, timeShift, users } = req.body;
  if (!date || !timeShift) {
    return res.status(400).json({ error: "Date and timeShift are required" });
  }
  if (date < new Date()) {
    return res.status(400).json({ error: "We are not supporting time travel" });
  }

  try {
    if (users && users.length > 0) {
      const userIds = users.map((u) => u.user);
      const existingUsers = await User.find({ _id: { $in: userIds } });
      if (existingUsers.length !== users.length) {
        return res
          .status(400)
          .json({ error: "One or more users do not exist" });
      }
    }

    const shift = await Shift.create(req.body);

    if (users && users.length > 0) {
      const updatePromises = users.map(async (userObj) => {
        return User.findByIdAndUpdate(
          userObj.user,
          {
            $push: {
              shifts: {
                shift: shift._id,
                date: date,
                timeShift: timeShift,
                table: userObj.table,
              },
            },
          },
          { new: true }
        );
      });

      await Promise.all(updatePromises);
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

export const startShift = async (req, res) => {
  const { userId } = req.params;
  const { shiftId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const shift = await Shift.findOneAndUpdate(
      { 
        _id: shiftId,
        "users.user": userId 
      },
      { 
        $set: { 
          "users.$.startShift": Date.now() 
        } 
      },
      { new: true }
    );

    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    res.status(200).json({ message: "Shift ended successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const endShift = async (req, res) => {
  const { userId } = req.params;
  const { shiftId } = req.body;
  console.log(userId, shiftId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const shift = await Shift.findOneAndUpdate(
      { 
        _id: shiftId,
        "users.user": userId 
      },
      { 
        $set: { 
          "users.$.endShift": Date.now() 
        } 
      },
      { new: true }
    );

    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    res.status(200).json({ message: "Shift ended successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
