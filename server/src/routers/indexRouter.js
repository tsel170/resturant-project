import express from "express";
import usersRouter from "./usersRouter.js";
import productRouter from "./productRouter.js";
import mealRouter from "./mealRouter.js";

const Router = express.Router();

Router.use("/users", usersRouter);
Router.use("/products", productRouter);
Router.use("/meals", mealRouter);

export default Router;
