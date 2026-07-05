import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js"; // Clean middleware import
import { upload } from "../config/multerConfig.js";

// Import each of your completely separated controllers
import { getTask } from "../controllers/task/Crud/getTask.js";
import { createTask } from "../controllers/task/Crud/createTask.js"; // Pulls both function and upload middleware
import { patchTask } from "../controllers/task/Crud/patchTask.js";
import { deleteTask } from "../controllers/task/Crud/deleteTask.js";


import { journalFeed } from "../controllers/task/Crud/journalFeed.js";
import { getComment } from "../controllers/task/Crud/fetchComment.js";




import { acceptFollowRequest } from "../controllers/task/profile_engagment.js/acceptFollowRequest.js";
import { getSmartProfileFeed } from "../controllers/task/profile_engagment.js/fetch_profileController.js";
import { getPendingRequests } from "../controllers/task/profile_engagment.js/getPendingRequests.js";
import { connectRequest } from "../controllers/task/profile_engagment.js/connectRequest.js";
import { fetch_Journal_When_Accepted } from "../controllers/task/profile_engagment.js/fetch_Journal_When_Accepted.js";
import { fetchEngagementDetails } from "../controllers/task/profile_engagment.js/fetchEngagementDetails.js";


import { toggleInteraction } from "../controllers/task/toggle_L_R.js";
import { commentFeed } from "../controllers/task/commentFeed.js";
import { establishConversation } from "../controllers/task/conversationController.js";

import cors from "cors";

const taskRoute = express.Router();
taskRoute.options('/{*wildcard}', cors());

taskRoute.get("/", ensureAuthenticated, getTask);
taskRoute.get("/profile/pending-requests", ensureAuthenticated, getPendingRequests);
taskRoute.get("/profile/:targetProfileUuid", ensureAuthenticated, getSmartProfileFeed);
taskRoute.get("/profile/innerCircle-details/:targetProfileUuid", ensureAuthenticated, fetchEngagementDetails);

taskRoute.get("/journalfeed/:journalUuid", ensureAuthenticated, journalFeed);
taskRoute.get("/:contentUuid/fetchComments", ensureAuthenticated, getComment);
taskRoute.get("/task/journal-posts/:targetProfileUuid", ensureAuthenticated, fetch_Journal_When_Accepted);

taskRoute.post("/:contentUuid/comments", ensureAuthenticated, commentFeed);
taskRoute.post("/", ensureAuthenticated, upload.single("img"), createTask);
taskRoute.post("/interaction/:contentUuid", ensureAuthenticated, toggleInteraction)
taskRoute.post("/profile/connect/:targetProfileUuid", ensureAuthenticated, connectRequest)
taskRoute.post("/:contentUuid/comments", ensureAuthenticated, commentFeed);
taskRoute.post("/fetchConversation", ensureAuthenticated, establishConversation);

taskRoute.patch("/profile/request-action", ensureAuthenticated, acceptFollowRequest);
taskRoute.patch("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRoute.delete("/:uuid", ensureAuthenticated, deleteTask);

export default taskRoute;
