import express from "express";
import {
  addBranch,
  getAllBranches,
  getBranchById,
  deleteBranch,
  updateBranch,
  addTable,
  updateTableSeats,
  deleteTable,
  updateTableOccupied
} from "../controller/branchController.js";

const Router = express.Router();

Router.post("/addBranch", addBranch);
Router.get("/allBranches", getAllBranches);
Router.get("/branch/:id", getBranchById);
Router.delete("/deleteBranch/:id", deleteBranch);
Router.put("/updateBranch/:id", updateBranch);
Router.delete("/deleteBranch/:id", deleteBranch);
Router.put("/addTable", addTable);
Router.put("/updateTableSeats", updateTableSeats);
Router.put("/updateTableOccupied", updateTableOccupied);
Router.delete("/deleteTable", deleteTable);

export default Router;
