import express from "express";
import usersRouter from "./usersRouter.js";

const Router = express.Router();

Router.use("/users", usersRouter);

export default Router;
