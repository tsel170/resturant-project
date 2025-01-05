import Branch from "../models/branchModel.js"

export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find()
    res.status(200).json(branches)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
    res.status(200).json(branch)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addBranch = async (req, res) => {

  try {
    console.log(await Branch.find());
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.status(200).json(branch)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id)
    res.status(200).json(branch)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addTable = async (req, res) => {
  const { branchId, tableNumber, seats } = req.body

  try {
    if (!branchId || !tableNumber || !seats) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: branchId, tableNumber, or seats",
      })
    }
    const branch = await Branch.findById(branchId)
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      })
    }
    const tableExists = branch.tables.some(
      (table) => table.tableNumber === tableNumber
    )
    if (tableExists) {
      return res.status(400).json({
        success: false,
        message: "Table number already exists in this branch",
      })
    }
    branch.tables.push({ tableNumber, seats })

    await branch.save()

    res.status(201).json({
      success: true,
      message: "Table added successfully",
      branch,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add table",
      error: err.message,
    })
  }
}

export const updateTableSeats = async (req, res) => {
  const { branchId, tableNumber, newSeats } = req.body

  try {
    if (!branchId || !tableNumber || !newSeats) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: branchId, tableNumber, or newSeats",
      })
    }

    const branch = await Branch.findById(branchId)
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      })
    }

    const table = branch.tables.find(
      (table) => table.tableNumber === tableNumber
    )
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      })
    }

    table.seats = newSeats

    await branch.save()

    res.status(200).json({
      success: true,
      message: "Table seats updated successfully",
      branch,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update table seats",
      error: err.message,
    })
  }
}

export const updateTableOccupied = async (req, res) => {
  const { branchId, tableNumber } = req.body

  try {
    const branch = await Branch.findById(branchId)
    const table = branch.tables.find(
      (table) => table.tableNumber === tableNumber
    )
    table.occuipied = !table.occuipied
    await branch.save()

    res.status(200).json({
      success: true,
      message: "Table seats updated successfully",
      branch,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update table seats",
      error: err.message,
    })
  }
}

export const deleteTable = async (req, res) => {
  const { branchId, tableNumber } = req.body
  
  try {
    if (!branchId || !tableNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: branchId or tableNumber",
      })
    }

    const branch = await Branch.findById(branchId)
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      })
    }

    const tableIndex = branch.tables.findIndex(
      (table) => table.tableNumber === tableNumber
    )
    if (tableIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      })
    }

    branch.tables.splice(tableIndex, 1)

    await branch.save()

    res.status(200).json({
      success: true,
      message: "Table deleted successfully",
      branch,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete table",
      error: err.message,
    })
  }
}
