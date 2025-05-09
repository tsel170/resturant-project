import express from "express";
import {
  addMeal,
  getAllMeals,
  deleteMeal,
  updateMeal,
  getSingleMeal,
  toggleMealAvailability,
} from "../controller/mealController.js";

const Router = express.Router();

Router.post("/addMeal", addMeal);
Router.get("/getSingleMeal/:id", getSingleMeal);
Router.get("/getAllMeals", getAllMeals);
Router.put("/updateMeal/:id", updateMeal);
Router.delete("/deleteMeal/:id", deleteMeal);
Router.put("/toggleAvailability/:id", toggleMealAvailability);
export default Router;
