import express from "express";
import {
  addMeal,
  getAllMeals,
  deleteMeal,
  changeMeal,
} from "../controller/mealController.js";

const Router = express.Router();

Router.post("/addMeal", addMeal);
Router.get("/getAllMeals", getAllMeals);
Router.delete("/deleteMeal/:id", deleteMeal);
Router.put("/changeMeal/:id", changeMeal);
export default Router;
