import express from "express";
import {
  createTask,
  getTask,
  patchTask,
  deleteTask,
  getEditPage,
  toggleLike
} from "../controllers/taskControllers.js";
import { ensureAuthenticated } from "./authRoute.js"; // make sure to export it

const taskRouter = express.Router();

// Protect routes

taskRouter.get("/", ensureAuthenticated, getTask);
taskRouter.post("/", ensureAuthenticated, createTask);
taskRouter.patch("/:uuid", ensureAuthenticated, patchTask);
taskRouter.delete("/:uuid", ensureAuthenticated, deleteTask);
taskRouter.get("/:uuid/post", ensureAuthenticated, getEditPage);
taskRouter.post("/:uuid/likes", ensureAuthenticated, toggleLike)

export default taskRouter;
