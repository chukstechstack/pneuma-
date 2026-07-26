import s3 from "@Terminal/Aws/AwsS3ClientConfig";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import redisClient from "@Terminal/Redis/redisCreateClient";
import pool from "@Terminal/Supabase/supabaseConfig.js";
import type { Request, Response, NextFunction } from "express";
import type { PoolClient } from "pg";

import { findTaskImageForCleanup, executeTaskDeletion } from "@Workshop/Payload/Mutations/deleteTaskService";

interface DeleteTaskParams {
  uuid: string;
  [key: string]: string;
}

interface AuthenticatedRequest extends Request<DeleteTaskParams, unknown, unknown> {
  user?: {
    id?: number | string;
    uuid?: string;
  };
}

interface DeleteTaskResponseData {
  message: string;
}

export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response<DeleteTaskResponseData | { error: string }>,
  next: NextFunction
) => {
  const { uuid } = req.params;
  const user_id = req.user?.id;
  const user_uuid = req.user?.uuid;

  if (user_id === undefined || user_id === null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const dbClient: PoolClient = await pool.connect();

  try {
    await dbClient.query("BEGIN");

    const taskRecord = await findTaskImageForCleanup(uuid, user_id, dbClient);
    if (!taskRecord) {
      await dbClient.query("ROLLBACK");
      return res.status(403).json({ error: "You are unauthorized or task not found" });
    }

    const deletedCount = await executeTaskDeletion(uuid, user_id, dbClient);
    if (deletedCount === 0) {
      await dbClient.query("ROLLBACK");
      return res.status(403).json({ error: "You are unauthorized" });
    }

    await dbClient.query("COMMIT");

    const imgUrl = taskRecord.img;
    if (typeof imgUrl === "string" && imgUrl) {
      try {
        const parsedUrl = new URL(imgUrl);
        const filePath = parsedUrl.pathname.substring(1);

        if (filePath) {
          s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePath
          })).then(() => console.log(`AWS S3 cleanup success: ${filePath}`))
            .catch((err: unknown) => {
              const errMsg = err instanceof Error ? err.message : String(err);
              console.error(`⚠️ S3 background cleanup failed for ${filePath}:`, errMsg);
            });
        }
      } catch (urlError: unknown) {
        const urlErrMsg = urlError instanceof Error ? urlError.message : String(urlError);
        console.error("⚠️ Malformed image URL found during cleanup phase:", urlErrMsg);
      }
    }

    try {
      if (user_uuid) {
        const homeFeedPattern = `tasks_feed:${user_uuid}:*`;
        const homeKeys = await redisClient.keys(homeFeedPattern);
        if (homeKeys.length > 0) {
          await redisClient.del(homeKeys);
          console.log(`🧹 Cache Reset: Swept away ${homeKeys.length} paginated home feed drawers.`);
        }

        const journalPattern = `journal_feed:${user_uuid}:*`;
        const journalKeys = await redisClient.keys(journalPattern);
        if (journalKeys.length > 0) {
          await redisClient.del(journalKeys);
          console.log(`🧹 Cache Reset: Swept away ${journalKeys.length} paginated private journal pages.`);
        }
      }
    } catch (cacheErr: unknown) {
      const cacheErrMsg = cacheErr instanceof Error ? cacheErr.message : String(cacheErr);
      console.error("⚠️ Non-critical Error in cache-busting invalidation process:", cacheErrMsg);
    }

    const responseData: DeleteTaskResponseData = { message: "Deleted successfully" };
    return res.status(200).json(responseData);

  } catch (err: unknown) {
    try {
      await dbClient.query("ROLLBACK");
    } catch {

    }
    console.error(err);
    return next(err);
  } finally {
    dbClient.release();
  }
};