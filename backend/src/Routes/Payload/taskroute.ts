import express from "express";
import { ensureAuthenticated } from "@/CheckPoint/Vip/authMiddleware.js";
import { upload } from "@/Terminal/Multer/multerConfig.js";

// Mutations & Controllers
import { getTask } from "@/Operator/Payload/Mutations/getTask.js";
import { createTask } from "@/Operator/Payload/Mutations/createTask.js";
import { patchTask } from "@/Operator/Payload/Mutations/patchTask.js";
import { deleteTask } from "@/Operator/Payload/Mutations/deleteTask.js";
import { updateAvatar } from "@/Operator/Payload/Mutations/updateAvatarService";
import { journalFeed } from "@/Operator/Payload/Mutations/journalFeed.js";

// Friend / Profile Controllers
import { getSmartProfileFeed } from "@/Operator/Payload/Friend/Profile_Controller/fetch_profileController.js";
import { getConnections } from "../../Operator/Payload/Friend/Connections/getConnections";
import { toggleConnection } from "../../Operator/Payload/Friend/Connections/toggleConnection";

// Messaging Gateway Controllers
import { fetchConversation } from "../Gateway/fetchMessages";
import { fetchConversationsList } from "../Gateway/fetchConversationList";

// Interactions Controllers
import { getTaskInteractions } from "../../Operator/Payload/Friend/getTaskInteractions ";
import { postTaskInteractions } from "../../Operator/Payload/Friend/postTaskInteractions";

// Alerts Controllers 🚀
import { getAlerts, markRead } from  "../../Operator/Payload/Friend/Alerts/getAlertsController"

import { getSingleTask } from "@/Operator/Payload/Mutations/getSingleTask";

const taskRoute = express.Router();

/* ==========================================
   1. GET ROUTES (Data Retrieval & Feeds)
   ================================          */
taskRoute.get("/", ensureAuthenticated, getTask);
taskRoute.get("/fetchConversation", ensureAuthenticated, fetchConversation);
taskRoute.get("/fetchConversationsList", ensureAuthenticated, fetchConversationsList);
taskRoute.get<{ taskId: string }>("/task/:taskId", ensureAuthenticated, getSingleTask);
taskRoute.get("/alerts", ensureAuthenticated, getAlerts);

taskRoute.get<{ targetProfileUuid: string }>("/profile/:targetProfileUuid", ensureAuthenticated, getSmartProfileFeed);
taskRoute.get<{ targetProfileUuid: string }>("/profile/:targetProfileUuid/connections", ensureAuthenticated, getConnections);
taskRoute.get<{ targetUserUuid: string }>("/journalfeed/:targetUserUuid", ensureAuthenticated, journalFeed);

taskRoute.get<{ taskUuid: string }>("/:taskUuid/interactions", ensureAuthenticated, getTaskInteractions);


/* ==========================================
   2. POST & PUT ROUTES (Creation & Updates)
   ================================          */
taskRoute.post("/", ensureAuthenticated, upload.single("img"), createTask);
taskRoute.post<{ taskUuid: string }>("/:taskUuid/interactions", ensureAuthenticated, postTaskInteractions);
taskRoute.post<{ targetProfileUuid: string }>("/profile/:targetProfileUuid/connect", ensureAuthenticated, toggleConnection);

taskRoute.put("/profile/avatar", ensureAuthenticated, upload.single("avatar"), updateAvatar);


/* ==========================================
   3. PATCH & DELETE ROUTES (Modifications & Removals)
   ================================          */
// 🔔 New Route to clear/mark an alert as read when clicked
taskRoute.patch<{ alertId: string }>("/alerts/:alertId/read", ensureAuthenticated, markRead);

taskRoute.patch<{ uuid: string }>("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRoute.delete<{ uuid: string }>("/:uuid", ensureAuthenticated, deleteTask);

export default taskRoute;