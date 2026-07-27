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

taskRoute.get<GetTaskParams>("/", ensureAuthenticated, getTask as express.RequestHandler<GetTaskParams>);
taskRoute.get<GetPendingRequestsParams>("/profile/pending-requests", ensureAuthenticated, getPendingRequests as express.RequestHandler<GetPendingRequestsParams>);
taskRoute.get<SmartProfileFeedParams>("/profile/:targetProfileUuid", ensureAuthenticated, getSmartProfileFeed as express.RequestHandler<SmartProfileFeedParams>);
taskRoute.get<InnerCircleDetailsParams>("/profile/innerCircle-details/:targetProfileUuid", ensureAuthenticated, fetchEngagementDetails as express.RequestHandler<InnerCircleDetailsParams>);

taskRoute.get<JournalFeedParams>("/journalfeed/:journalUuid", ensureAuthenticated, journalFeed as express.RequestHandler<JournalFeedParams>);
taskRoute.get<GetCommentParams>("/:contentUuid/fetchComments", ensureAuthenticated, getComment as express.RequestHandler<GetCommentParams>);
taskRoute.get<FetchJournalRequestParams>("/task/journal-posts/:targetProfileUuid", ensureAuthenticated, fetch_Journal_When_Accepted as express.RequestHandler<FetchJournalRequestParams>);

taskRoute.post<CommentFeedParams>("/:contentUuid/comments", ensureAuthenticated, commentFeed as express.RequestHandler<CommentFeedParams>);
taskRoute.post<CreateTaskParams>("/", ensureAuthenticated, upload.single("img"), createTask as express.RequestHandler<CreateTaskParams>);
taskRoute.post<ToggleInteractionParams>("/interaction/:contentUuid", ensureAuthenticated, toggleInteraction as express.RequestHandler<ToggleInteractionParams>);
taskRoute.post<ConnectRequestParams>("/profile/connect/:targetProfileUuid", ensureAuthenticated, connectRequest as express.RequestHandler<ConnectRequestParams>);

taskRoute.patch<AcceptFollowRequestParams>("/profile/request-action", ensureAuthenticated, acceptFollowRequest as express.RequestHandler<AcceptFollowRequestParams>);
taskRoute.patch<PatchTaskParams>("/:uuid", ensureAuthenticated, upload.single("img"), patchTask as express.RequestHandler<PatchTaskParams>);
taskRoute.delete<DeleteTaskParams>("/:uuid", ensureAuthenticated, deleteTask as express.RequestHandler<DeleteTaskParams>);

export default taskRoute;