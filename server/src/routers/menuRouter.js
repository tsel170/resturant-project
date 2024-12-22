import express from "express";
import {
  addMenu,
  getAllMenus,
  updateMenuById,
  deleteMenu,
  addMealToMenu,
} from "../controller/menuController.js";

const Router = express.Router();

Router.post("/addMenu", addMenu);
Router.get("/getAllMenus", getAllMenus);
Router.put("/updateMenu/:id", updateMenuById);
Router.delete("/deleteMenu/:id", deleteMenu);
Router.put("/addMealToMenu/:id", addMealToMenu);

export default Router;
