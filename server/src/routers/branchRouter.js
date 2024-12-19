import express from "express";
import {
  addBranch,
  getAllBranches,
  getBranchById,
  deleteBranch,
  updateBranch,
} from "../controller/branchController.js";

const Router = express.Router();

Router.post("/addBranch", addBranch);
Router.get("/branches", getAllBranches);
Router.get("/branch/:id", getBranchById);
Router.delete("/deleteBranch/:id", deleteBranch);
Router.put("/updateBranch/:id", updateBranch);

export default Router;
