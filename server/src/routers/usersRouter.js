import express from "express";
import { register, login, getAllUsers } from "../controller/userController.js";

const Router = express.Router();

Router.post("/register", register);
Router.post("/login", login);
Router.get("/users", getAllUsers);

export default Router;
