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
} from "../controller/branchController.js";

const Router = express.Router();

Router.post("/addBranch", addBranch);
Router.get("/allBbranches", getAllBranches);
Router.get("/getBranch/:id", getBranchById);
Router.put("/updateBranch/:id", updateBranch);
Router.delete("/deleteBranch/:id", deleteBranch);
Router.put("/addTable", addTable);
Router.put("/updateTableSeats", updateTableSeats);
Router.delete("/deleteTable", deleteTable);

export default Router;
