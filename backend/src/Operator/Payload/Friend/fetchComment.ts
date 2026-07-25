import type { Request, Response, NextFunction } from "express";
import { fetchCommentsQuery, fetchContentIdByUuid, CommentRow } from "@Workshop/Payload/Mutations/getComments";

interface GetCommentsQuery {
  freeze_time?: string;
  fresh_load?: string;
}

interface GetCommentsParams {
  contentUuid: string;
}

interface CommentsResponseData {
  comments: CommentRow[];
  next_comment_timestamp: number | null;
}

export const getComment = async (
  req: Request<GetCommentsParams, any, any, GetCommentsQuery>,
  res: Response<CommentsResponseData | { error: string }>,
  next: NextFunction
) => {
  const { contentUuid } = req.params;
  const freeze_time = req.query.freeze_time || String(Date.now());
  const fresh_load_pointer = req.query.fresh_load || "Yes_Is_FreshLoad";

  try {
    const content_id = await fetchContentIdByUuid(contentUuid);
    
    if (content_id === null) {
      return res.status(404).json({ error: "Post not found" });
    }

    const freeze_Time_Date = new Date(Number(freeze_time));
    
    let lastCommentDateParam: Date | undefined = undefined;
    if (fresh_load_pointer && fresh_load_pointer !== "Yes_Is_FreshLoad") {
      lastCommentDateParam = new Date(Number(fresh_load_pointer));
    }

    const commentData = await fetchCommentsQuery(
      content_id,
      freeze_Time_Date,
      fresh_load_pointer,
      lastCommentDateParam
    );

    let next_comment_timestamp: number | null = null;

    if (commentData.length === 40) {
      const lastItem = commentData[commentData.length - 1];
      next_comment_timestamp = new Date(lastItem.created_at).getTime();
    }

    return res.status(200).json({
      comments: commentData,
      next_comment_timestamp: next_comment_timestamp
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ BACKEND CONTROLLER LAYER caught a comments crash:", errorMessage);
    next(err);
  }
};