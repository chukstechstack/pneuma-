import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js"; // Clean middleware import

// Import each of your completely separated controllers
import { getTask } from "../controllers/task/getTask.js";
import { upload, createTask } from "../controllers/task/createTask.js"; // Pulls both function and upload middleware
import { patchTask } from "../controllers/task/patchTask.js";
import { deleteTask } from "../controllers/task/deleteTask.js";
import { getEditPage } from "../controllers/task/fetchEditTask.js";
import { toggleLike } from "../controllers/task/toggleLike.js";

const taskRoute = express.Router();


taskRoute.get("/", ensureAuthenticated, getTask);
taskRoute.post("/", ensureAuthenticated, upload.single("img"), createTask);
taskRoute.patch("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRoute.delete("/:uuid", ensureAuthenticated, deleteTask);
taskRoute.get("/:uuid/post", ensureAuthenticated, getEditPage);
taskRoute.post("/:uuid/likes", ensureAuthenticated, toggleLike);

export default taskRoute;
