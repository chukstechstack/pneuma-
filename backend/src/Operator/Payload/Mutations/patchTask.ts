import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/Terminal/Aws/AwsS3ClientConfig.js";
import redisClient from "@Terminal/Redis/redisCreateClient.js";
import pool from "@Terminal/Supabase/supabaseConfig.js";
import { fetchOldTaskImage, executeDynamicTaskUpdate } from "@/Workshop/Payload/Mutations/patchTaskService.js";
import type { Request, Response, NextFunction } from "express";
import type { Pool, PoolClient } from "pg";

interface PatchTaskRequestParams {
  uuid: string;
}

interface PatchTaskRequestBody {
  content?: string;
}

interface PatchTaskResponseData {
  message: string;
  updatedTask: unknown;
}

type AuthenticatedRequest = Request<PatchTaskRequestParams, unknown, PatchTaskRequestBody> & {
  user?: {
    id?: number | string;
    uuid?: string;
  };
};

export const patchTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.user?.id;
  const user_uuid = req.user?.uuid;
  const { uuid } = req.params;

  if (user_id === undefined || user_id === null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let newUrl: string | null = null;
  let uploadedFileName: string | null = null;
  const dbClient: PoolClient = await pool.connect();
  const dbClientAsPool = dbClient as unknown as Pool;

  try {
    await dbClient.query("BEGIN");

    if (req.file) {
      const oldImgRecord = await fetchOldTaskImage(uuid, user_id, dbClientAsPool);
      const oldImgUrl = oldImgRecord?.img;
      
      // Cleaned up: Safely attempt deletion without a messy nested try/catch
      if (oldImgUrl) {
        try {
          const parsedUrl = new URL(oldImgUrl);
          const filePath = parsedUrl.pathname.substring(1);

          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePath
          }));
        } catch {
          // Silently ignore malformed old image URLs and push forward
        }
      }

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

      newUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadedFileName}`;
    }

    const finalUpdateResult = await executeDynamicTaskUpdate(
      uuid,
      user_id,
      req.body.content,
      newUrl,
      dbClientAsPool
    ) as { rowCount: number; rows: unknown[] } | null;

    if (!finalUpdateResult) {
      await dbClient.query("ROLLBACK");
      dbClient.release();
      return res.status(400).json({ error: "No fields provided for update" });
    }

    if (finalUpdateResult.rowCount === 0) {
      await dbClient.query("ROLLBACK");
      dbClient.release();
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    await dbClient.query("COMMIT");

    // =================================================================
    // 🧹 WILDCARD REDIS CACHE INVALIDATION SYSTEM (RUNS AFTER COMMIT)
    // =================================================================
    try {
      if (user_uuid) {
        const homeFeedPattern = `tasks_feed:${user_uuid}:*`;
        const homeKeys = await redisClient.keys(homeFeedPattern);
        if (homeKeys.length > 0) {
          await redisClient.del(homeKeys);
          console.log(`🧹 Cache Reset: Swept away ${homeKeys.length} paginated home feed chunks.`);
        }

        const journalPattern = `journal_feed:${user_uuid}:*`;
        const journalKeys = await redisClient.keys(journalPattern);
        if (journalKeys.length > 0) {
          await redisClient.del(journalKeys);
          console.log(`🧹 Cache Reset: Swept away ${journalKeys.length} paginated private feed chunks.`);
        }
      }
    } catch (cacheErr: unknown) {
      const cacheErrMsg = cacheErr instanceof Error ? cacheErr.message : String(cacheErr);
      console.error("⚠️ Non-critical Error in cache-busting invalidation process:", cacheErrMsg);
    }

    const responseData: PatchTaskResponseData = {
      message: "Task updated successfully",
      updatedTask: finalUpdateResult.rows[0]
    };

    return res.json(responseData);

  } catch (err) {
    try {
      await dbClient.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }

    if (uploadedFileName) {
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: uploadedFileName
        }));
        console.log(`Successfully cleaned up orphan S3 file: ${uploadedFileName}`);
      } catch (s3DeleteErr) {
        console.error("Critical: Failed to clean up orphan S3 asset during rollback:", s3DeleteErr);
      }
    }

    next(err);
  } finally {
    dbClient.release();
  }
};