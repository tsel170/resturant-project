import Branch from "../models/branchModel.js";

export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
