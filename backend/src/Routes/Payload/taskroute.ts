import express from "express";
import { ensureAuthenticated } from "@/CheckPoint/Vip/authMiddleware";
import { upload } from "@/Terminal/Multer/multerConfig";

import { getTask } from "@/Operator/Payload/Mutations/getTask.js";
import { createTask } from "@/Operator/Payload/Mutations/createTask";
import { patchTask } from "@/Operator/Payload/Mutations/patchTask";
import { deleteTask } from "@/Operator/Payload/Mutations/deleteTask";

import { journalFeed } from "@/Operator/Payload/Mutations/journalFeed";
import { getComment } from "@/Operator/Payload/Mutations/fetchComment";

import { acceptFollowRequest } from "@/Operator/Payload/Friend/acceptFollowRequest";
import { getSmartProfileFeed } from "@/Operator/Payload/Friend/fetch_profileController";
import { getPendingRequests } from "@/Operator/Payload/Friend/getPendingRequests";
import { connectRequest } from "@/Operator/Payload/Friend/connectRequest.js";
import { fetch_Journal_When_Accepted } from "@/Operator/Payload/Friend/fetch_Journal_When_Accepted";
import { fetchEngagementDetails } from "@/Operator/Payload/Friend/fetch_Inner_Circle";

import { toggleInteraction } from "@/Operator/Payload/toggle_L_R";
import { commentFeed } from "@/Operator/Payload/commentFeed";


const taskRoute = express.Router();

interface EmptyParams {
  [key: string]: string;
}

interface GetTaskParams {
  [key: string]: string;
}

interface GetPendingRequestsParams {
  [key: string]: string;
}

interface SmartProfileFeedParams {
  targetProfileUuid: string;
  [key: string]: string;
}

interface InnerCircleDetailsParams {
  targetProfileUuid: string;
  [key: string]: string;
}

interface JournalFeedParams {
  journalUuid: string;
  [key: string]: string;
}

interface GetCommentParams {
  contentUuid: string;
  [key: string]: string;
}

interface FetchJournalRequestParams {
  targetProfileUuid: string;
  [key: string]: string;
}

interface CommentFeedParams {
  contentUuid: string;
  [key: string]: string;
}

interface CreateTaskParams {
  [key: string]: string;
}

interface ToggleInteractionParams {
  contentUuid: string;
  [key: string]: string;
}

interface ConnectRequestParams {
  targetProfileUuid: string;
  [key: string]: string;
}

interface EstablishConversationParams {
  [key: string]: string;
}

interface AcceptFollowRequestParams {
  [key: string]: string;
}

interface PatchTaskParams {
  uuid: string;
  [key: string]: string;
}

interface DeleteTaskParams {
  uuid: string;
  [key: string]: string;
}

taskRoute.get<GetTaskParams>("/", ensureAuthenticated, getTask);
taskRoute.get<GetPendingRequestsParams>("/profile/pending-requests", ensureAuthenticated, getPendingRequests);
taskRoute.get<SmartProfileFeedParams>("/profile/:targetProfileUuid", ensureAuthenticated, getSmartProfileFeed);
taskRoute.get<InnerCircleDetailsParams>("/profile/innerCircle-details/:targetProfileUuid", ensureAuthenticated, fetchEngagementDetails);

taskRoute.get<JournalFeedParams>("/journalfeed/:journalUuid", ensureAuthenticated, journalFeed);
taskRoute.get<GetCommentParams>("/:contentUuid/fetchComments", ensureAuthenticated, getComment);
taskRoute.get<FetchJournalRequestParams>("/task/journal-posts/:targetProfileUuid", ensureAuthenticated, fetch_Journal_When_Accepted);

taskRoute.post<CommentFeedParams>("/:contentUuid/comments", ensureAuthenticated, commentFeed);
taskRoute.post<CreateTaskParams>("/", ensureAuthenticated, upload.single("img"), createTask);
taskRoute.post<ToggleInteractionParams>("/interaction/:contentUuid", ensureAuthenticated, toggleInteraction);
taskRoute.post<ConnectRequestParams>("/profile/connect/:targetProfileUuid", ensureAuthenticated, connectRequest);

taskRoute.patch<AcceptFollowRequestParams>("/profile/request-action", ensureAuthenticated, acceptFollowRequest);
taskRoute.patch<PatchTaskParams>("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRoute.delete<DeleteTaskParams>("/:uuid", ensureAuthenticated, deleteTask);

export default taskRoute;