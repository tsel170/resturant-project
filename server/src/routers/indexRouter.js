import express from "express";
import usersRouter from "./usersRouter.js";
import productRouter from "./productRouter.js";
import bonRouter from "./bonRouter.js";
import mealRouter from "./mealRouter.js";
import menuRouter from "./menuRouter.js";

const Router = express.Router();

Router.use("/users", usersRouter);

Router.use("/products", productRouter);

Router.use("/orders", bonRouter);

Router.use("/meals", mealRouter);

Router.use("/menus", menuRouter);

export default Router;
