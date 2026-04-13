import express from "express";
import { authRouter } from "../authRoute.js";

const mainAuthRouter = express.Router();

mainAuthRouter.use("/", authRouter);

export { mainAuthRouter };
