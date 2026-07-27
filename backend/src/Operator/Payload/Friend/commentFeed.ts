

import type { Request, Response, NextFunction } from "express";
import { executeInsertComment } from "@/Workshop/Payload/Friend/commentServices.js";
import { getErrorMessage } from "../../../Toolkit/GetErrorMessage/getErrorMessage.js";

// Use Express.User so it connects straight to our global UserProfile badge!
interface CustomRequest<P = Record<string, any>, ResBody = any, ReqBody = any, ReqQuery = Record<string, any>> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: Express.User & { id?: string | number };
}

interface CommentFeedParams {
  contentUuid: string;
}

interface CommentFeedRequestBody {
  comment_text?: string;
}

export const commentFeed = async (
  req: CustomRequest<CommentFeedParams, unknown, CommentFeedRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { contentUuid } = req.params;
  const { comment_text } = req.body;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const result = await executeInsertComment(contentUuid, user_id, comment_text);

    if ("error" in result) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(201).json(result.comment);

  } catch (err: unknown) {
    console.error("❌ BACKEND CONTROLLER LAYER caught a comment crash:", getErrorMessage(err));
    next(err);
  }
};