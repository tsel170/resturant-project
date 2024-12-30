import express from "express";
import {
  addBon,
  getAllBons,
  updateBon,
  deleteBon,
} from "../controller/bonController.js";

const Router = express.Router();

Router.post("/addBon", addBon);
Router.get("/allBons", getAllBons);
Router.put("/updateBon/:id", updateBon);
Router.delete("/deleteBon/:id", deleteBon);

export default Router;
