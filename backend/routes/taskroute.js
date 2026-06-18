import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js"; // Clean middleware import

// Import each of your completely separated controllers
import { getTask } from "../controllers/task/getTask.js";
import { createTask } from "../controllers/task/createTask.js"; // Pulls both function and upload middleware
import { patchTask } from "../controllers/task/patchTask.js";
import { deleteTask } from "../controllers/task/deleteTask.js";
import { upload } from "../config/multerConfig.js";
import { toggleInteraction } from "../controllers/task/interaction.js";
import { toggleFollow } from "../controllers/task/follow.js";
import { journalFeed } from "../controllers/task/journalFeed.js";
import { commentFeed } from "../controllers/task/commentFeed.js";
import { getComment } from "../controllers/task/fetchComment.js";
import { establishConversation } from "../controllers/task/conversationController.js";
import { acceptFollowRequest } from "../controllers/task/acceptFollowRequest.js";
import { getSmartProfileFeed } from "../controllers/task/profileController.js";

const taskRoute = express.Router();

taskRoute.get("/", ensureAuthenticated, getTask);
taskRoute.get("/profile/:targetProfileUuid", ensureAuthenticated, getSmartProfileFeed);
taskRoute.get("/journalfeed/:journalUuid", ensureAuthenticated, journalFeed);
taskRoute.get("/:contentUuid/fetchComments", ensureAuthenticated, getComment); // 🎯 FIXED: Removed the 's' at the end!

taskRoute.post("/:contentUuid/comments", ensureAuthenticated, commentFeed);
taskRoute.post("/", ensureAuthenticated, upload.single("img"), createTask);
taskRoute.post("/interaction/:contentUuid", ensureAuthenticated, toggleInteraction)
taskRoute.post("/profile/follow/:targetProfileUuid", ensureAuthenticated, toggleFollow)
taskRoute.post("/:contentUuid/comments", ensureAuthenticated, commentFeed);
taskRoute.post("/fetchConversation", ensureAuthenticated, establishConversation);
taskRoute.post("/profile/accept/:followedUserUuid", ensureAuthenticated, acceptFollowRequest);

taskRoute.patch("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRoute.delete("/:uuid", ensureAuthenticated, deleteTask);

export default taskRoute;
