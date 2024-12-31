import express from "express";
import {
  addBon,
  getAllBons,
  updateBon,
  deleteBon,
  updateDeliveredBon,
  updateReadyBon,
  updatePaidBon,
} from "../controller/bonController.js";

const Router = express.Router();

Router.post("/addBon", addBon);
Router.get("/allBons", getAllBons);
Router.put("/updateBon/:id", updateBon);
Router.delete("/deleteBon/:id", deleteBon);
Router.put("/updateDeliveredBon/:id", updateDeliveredBon);
Router.put("/updateReadyBon/:id", updateReadyBon);
Router.put("/updatePaidBon/:id", updatePaidBon);

export default Router;
