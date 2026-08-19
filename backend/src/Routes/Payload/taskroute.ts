import express from "express";
import { ensureAuthenticated } from "@/CheckPoint/Vip/authMiddleware.js";
import { upload } from "@/Terminal/Multer/multerConfig.js";

import { getTask } from "@/Operator/Payload/Mutations/getTask.js";
import { createTask } from "@/Operator/Payload/Mutations/createTask.js";
import { patchTask } from "@/Operator/Payload/Mutations/patchTask.js";
import { deleteTask } from "@/Operator/Payload/Mutations/deleteTask.js";

import { journalFeed } from "@/Operator/Payload/Mutations/journalFeed.js";

import { getSmartProfileFeed } from "@/Operator/Payload/Friend/fetch_profileController.js";
import { fetchConversation } from "../Gateway/fetchMessages";

import { fetchConversationsList } from "../Gateway/fetchConversationList"; // Adjust path to your controller

// Add this route under your existing task routes


const taskRoute = express.Router();


taskRoute.get("/", ensureAuthenticated, getTask);
taskRoute.get("/fetchConversation", ensureAuthenticated, fetchConversation);
taskRoute.get("/fetchConversationsList", ensureAuthenticated, fetchConversationsList);

taskRoute.post("/", ensureAuthenticated, upload.single("img"), createTask);

taskRoute.get<{ targetProfileUuid: string }>("/profile/:targetProfileUuid", ensureAuthenticated, getSmartProfileFeed);
taskRoute.get<{ targetUserUuid: string }>("/journalfeed/:targetUserUuid", ensureAuthenticated, journalFeed);

taskRoute.patch<{ uuid: string }>("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRoute.delete<{ uuid: string }>("/:uuid", ensureAuthenticated, deleteTask);

export default taskRoute;