import express from "express";
import taskRouter from "../taskRoute.js";

const mainTaskRouter = express.Router();

mainTaskRouter.use("/", taskRouter);


export default mainTaskRouter ;