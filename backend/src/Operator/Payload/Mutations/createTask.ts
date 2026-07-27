import TaskInputError from "@Toolkits/Input/taskInputError.js"
import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@Terminal/Aws/AwsS3ClientConfig.js";
import redisClient from "@Terminal/Redis/redisCreateClient.js";
import pool from "@Terminal/Supabase/supabaseConfig.js";
import type { Request, Response, NextFunction } from "express";
import type { PoolClient } from "pg";

import { insertNewTask, fetchHydratedTaskById } from "@Workshop/Payload/Mutations/createTaskService.js";

interface CreateTaskParams {
  [key: string]: string;
}

interface CreateTaskRequestBody {
  content?: string;
  [key: string]: unknown;
}

interface AuthenticatedRequest extends Request<CreateTaskParams, unknown, CreateTaskRequestBody> {
  user?: {
    id?: number | string;
    uuid?: string;
  };
}

interface CreateTaskResponseData {
  message: string;
  newTask: unknown;
}

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response<CreateTaskResponseData | { error: string }>,
  next: NextFunction
) => {
  const content = req.body.content;
  const user_uuid = req.user?.uuid;
  const user_id = req.user?.id;

  if (user_id === undefined || user_id === null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let img_url: string | null = null;
  let uploadedFileName: string | null = null;
  const dbClient: PoolClient = await pool.connect();

  try {
    if (!content) {
      throw new TaskInputError("Content is required");
    }

    await dbClient.query("BEGIN");

    if (req.file) {
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      uploadedFileName = `tasks/${Date.now()}-optimized.webp`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uploadedFileName,
        Body: optimizedBuffer,
        ContentType: "image/webp"
      }));

      img_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadedFileName}`;
    }

    const savedTaskData = await insertNewTask(content, img_url, user_id, dbClient);
    if (!savedTaskData) {
      throw new Error("Failed to persist task resource data");
    }

    const resultWithUser = await fetchHydratedTaskById(savedTaskData.id, dbClient);

    await dbClient.query("COMMIT");

    try {
      if (user_uuid) {
        const homeFeedPattern = `tasks_feed:${user_uuid}:*`;
        const homeKeys = await redisClient.keys(homeFeedPattern);
        if (homeKeys.length > 0) {
          await redisClient.del(homeKeys);
          console.log(`🧹 Creation Cache Reset: Swept away ${homeKeys.length} home feed chunks.`);
        }

        const journalPattern = `journal_feed:${user_uuid}:*`;
        const journalKeys = await redisClient.keys(journalPattern);
        if (journalKeys.length > 0) {
          await redisClient.del(journalKeys);
          console.log(`🧹 Creation Cache Reset: Swept away ${journalKeys.length} private feed chunks.`);
        }
      }
    } catch (cacheErr: unknown) {
      const cacheErrMsg = cacheErr instanceof Error ? cacheErr.message : String(cacheErr);
      console.error("⚠️ Non-critical Error in cache-busting during post creation:", cacheErrMsg);
    }

    const responseData: CreateTaskResponseData = {
      message: "Content created successfully",
      newTask: resultWithUser,
    };

    return res.json(responseData);

  } catch (err: unknown) {
    try {
      await dbClient.query("ROLLBACK");
    } catch {
      // Quietly swallow if client was already broken
    }

    if (uploadedFileName) {
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: uploadedFileName
        }));
        console.log(`Successfully cleaned up orphan S3 file: ${uploadedFileName}`);
      } catch (s3DeleteErr: unknown) {
        const s3DeleteErrMsg = s3DeleteErr instanceof Error ? s3DeleteErr.message : String(s3DeleteErr);
        console.error("Critical: Failed to clean up orphan S3 asset during rollback:", s3DeleteErrMsg);
      }
    }

    next(err);
  } finally {
    dbClient.release();
  }
};