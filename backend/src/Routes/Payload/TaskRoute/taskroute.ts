import express from "express";
import {
   ensureAuthenticated,
   upload,
   getTask,
   createTask,
   patchTask,
   deleteTask,
   updateAvatar,
   journalFeed,
   getSingleTask,
   getSmartProfileFeed,
   getConnections,
   toggleConnection,
   getProfileSettingsController,
   updateProfileController,
   getTaskProfileController,
   fetchConversation,
   fetchConversationsList,
   getTaskInteractions,
   postTaskInteractions,
   getAlerts,
   markRead,
} from "./imports"; // 👈 Update path to your imports file if needed

const taskRoute = express.Router();

/* ==========================================
   1. GET ROUTES (Data Retrieval & Feeds)
   ========================================== */
taskRoute.get("/", ensureAuthenticated, getTask);
taskRoute.get("/fetchConversation", ensureAuthenticated, fetchConversation);
taskRoute.get("/fetchConversationsList", ensureAuthenticated, fetchConversationsList);
taskRoute.get("/alerts", ensureAuthenticated, getAlerts);

taskRoute.get("/profile/settings", ensureAuthenticated, getProfileSettingsController);
taskRoute.get(
   "/profile/task-profile/:targetProfileUuid",
   ensureAuthenticated,
   getTaskProfileController as unknown as express.RequestHandler,
);
taskRoute.get<{ taskId: string }>("/:taskId", ensureAuthenticated, getSingleTask);

taskRoute.get<{ targetProfileUuid: string }>("/profile/:targetProfileUuid", ensureAuthenticated, getSmartProfileFeed);
taskRoute.get<{ targetProfileUuid: string }>("/profile/:targetProfileUuid/connections", ensureAuthenticated, getConnections);
taskRoute.get<{ targetUserUuid: string }>("/journalfeed/:targetUserUuid", ensureAuthenticated, journalFeed);

taskRoute.get<{ taskUuid: string }>("/:taskUuid/interactions", ensureAuthenticated, getTaskInteractions);

/* ==========================================
   2. POST & PUT ROUTES (Creation & Updates)
   ========================================== */
taskRoute.post("/", ensureAuthenticated, upload.single("img"), createTask);
taskRoute.post<{ taskUuid: string }>("/:taskUuid/interactions", ensureAuthenticated, postTaskInteractions);
taskRoute.post<{ targetProfileUuid: string }>("/profile/:targetProfileUuid/connect", ensureAuthenticated, toggleConnection);

taskRoute.put("/profile/avatar", ensureAuthenticated, upload.single("avatar"), updateAvatar);
taskRoute.put("/profile/update", ensureAuthenticated, updateProfileController);

/* ==========================================
   3. PATCH & DELETE ROUTES (Modifications & Removals)
   ========================================== */
taskRoute.patch<{ alertId: string }>("/alerts/:alertId/read", ensureAuthenticated, markRead);
taskRoute.patch<{ uuid: string }>("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRoute.delete<{ uuid: string }>("/:uuid", ensureAuthenticated, deleteTask);

export default taskRoute;