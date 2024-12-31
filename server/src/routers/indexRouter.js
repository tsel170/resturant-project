import express from "express";
import usersRouter from "./usersRouter.js";
import productRouter from "./productRouter.js";
import bonRouter from "./bonRouter.js";
import mealRouter from "./mealRouter.js";
import menuRouter from "./menuRouter.js";
import branchRouter from "./branchRouter.js";
import shiftRouter from "./shiftRouter.js";

const Router = express.Router();

Router.use("/users", usersRouter);

Router.use("/products", productRouter);

Router.use("/bons", bonRouter);

Router.use("/meals", mealRouter);

Router.use("/menus", menuRouter);

Router.use("/branches", branchRouter);

Router.use("/shifts", shiftRouter);

export default Router;
