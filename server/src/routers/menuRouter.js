import express from "express";
import {
  addMenu,
  getAllMenus,
  changeMenu,
  dealteMenu,
} from "../controller/menuController.js";

const Router = express.Router();

Router.post("/addMenu", addMenu);
Router.get("/menus", getAllMenus);
Router.put("/changeMenu/:id", changeMenu);
Router.delete("/deleteMenu/:id", dealteMenu);

export default Router;
