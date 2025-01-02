import express from "express";
import {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
} from "../controller/userController.js";

const Router = express.Router();

Router.post("/register", register);
Router.post("/login", login);
Router.get("/users", getAllUsers);
Router.put("/updateUser/:id", updateUser);
Router.delete("/deleteUser/:id", deleteUser);
Router.get("/user/:id", getUser);

export default Router;
