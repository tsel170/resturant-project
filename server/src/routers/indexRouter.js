import express from "express";
import usersRouter from "./usersRouter.js";
import productRouter from "./productRouter.js";

const Router = express.Router();

Router.use("/users", usersRouter);
Router.use("/products", productRouter);

export default Router;
