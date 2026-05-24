import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js"; // Clean middleware import

// Import each of your completely separated controllers
import { getTask } from "../controllers/task/getTask.js";
import { createTask } from "../controllers/task/createTask.js"; // Pulls both function and upload middleware
import { patchTask } from "../controllers/task/patchTask.js";
import { deleteTask } from "../controllers/task/deleteTask.js";
import { upload } from "../config/multerConfig.js";
import { toggleInteraction } from "../controllers/task/toggleInteraction.js";

const taskRoute = express.Router();


taskRoute.get("/", ensureAuthenticated, getTask);
taskRoute.post("/", ensureAuthenticated, upload.single("img"), createTask);
taskRoute.patch("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRoute.delete("/:uuid", ensureAuthenticated, deleteTask);
taskRoute.post("/interaction/:contentUuid", ensureAuthenticated, toggleInteraction)


export default taskRoute;
