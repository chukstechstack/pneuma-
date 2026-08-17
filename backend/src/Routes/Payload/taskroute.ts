import express from "express";
import { ensureAuthenticated } from "@/CheckPoint/Vip/authMiddleware.js";
import { upload } from "@/Terminal/Multer/multerConfig.js";

import { getTask } from "@/Operator/Payload/Mutations/getTask.js";
import { createTask } from "@/Operator/Payload/Mutations/createTask.js";
import { patchTask } from "@/Operator/Payload/Mutations/patchTask.js";
import { deleteTask } from "@/Operator/Payload/Mutations/deleteTask.js";

import { journalFeed } from "@/Operator/Payload/Mutations/journalFeed.js";
import { getComment } from "@/Operator/Payload/Friend/fetchComment.js";

import { acceptFollowRequest } from "@/Operator/Payload/Friend/acceptFollowRequest.js";
import { getSmartProfileFeed } from "@/Operator/Payload/Friend/fetch_profileController.js";
import { getPendingRequests } from "@/Operator/Payload/Friend/getPendingRequests.js";
import { connectRequest } from "@/Operator/Payload/Friend/connectRequest.js";
import { fetch_Journal_When_Accepted } from "@/Operator/Payload/Friend/fetch_Journal_When_Accepted.js";
import { fetchEngagementDetails } from "@/Operator/Payload/Friend/fetch_Inner_Circle.js";

import { toggleInteraction } from "@/Operator/Payload/Friend/toggle_L_R.js";
import { commentFeed } from "@/Operator/Payload/Friend/commentFeed.js";

const taskRoute = express.Router();


taskRoute.get("/", ensureAuthenticated, getTask);
taskRoute.get("/profile/pending-requests", ensureAuthenticated, getPendingRequests);
taskRoute.patch("/profile/request-action", ensureAuthenticated, acceptFollowRequest as unknown as express.RequestHandler);
taskRoute.post("/", ensureAuthenticated, upload.single("img"), createTask);


taskRoute.get<{ targetProfileUuid: string }>("/profile/:targetProfileUuid", ensureAuthenticated, getSmartProfileFeed);
taskRoute.get<{ targetProfileUuid: string }>("/profile/innerCircle-details/:targetProfileUuid", ensureAuthenticated, fetchEngagementDetails);
taskRoute.get<{ targetUserUuid: string }>("/journalfeed/:targetUserUuid", ensureAuthenticated, journalFeed);
taskRoute.get<{ contentUuid: string }>("/:contentUuid/fetchComments", ensureAuthenticated, getComment);
taskRoute.get<{ targetProfileUuid: string }>("/task/journal-posts/:targetProfileUuid", ensureAuthenticated, fetch_Journal_When_Accepted);

taskRoute.post<{ contentUuid: string }>("/:contentUuid/comments", ensureAuthenticated, commentFeed);
taskRoute.post<{ contentUuid: string }>("/interaction/:contentUuid", ensureAuthenticated, toggleInteraction);
taskRoute.post<{ targetProfileUuid: string }>("/profile/connect/:targetProfileUuid", ensureAuthenticated, connectRequest);

taskRoute.patch<{ uuid: string }>("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRoute.delete<{ uuid: string }>("/:uuid", ensureAuthenticated, deleteTask);

export default taskRoute;