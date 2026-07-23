import TaskInputError from "../../../../utils/taskInputError.js";
import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../../config/AwsS3ClientConfig.js";
import redisClient from "../../../config/redisCreateClient.js";
import pool from "../../../config/supabaseConfig.js";

// Import your newly created database service workers
import { insertNewTask, fetchHydratedTaskById } from "../../../../services/task/createTaskService.js";

export const createTask = async (req, res, next) => {
  const { content } = req.body;
  const user_uuid = req.user?.uuid;
  const user_id = req.user?.id;

  let img_url = null;
  let uploadedFileName = null; // Track file name for S3 emergency rollback
  const dbClient = await pool.connect(); // Checkout a single database client connection

  try {
    if (!content) throw new TaskInputError("Content is required");

    // Start database transaction block
    await dbClient.query("BEGIN");

    // Transform and stream data to S3 if a file is uploaded
    if (req.file) {
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      // Track the name before uploading so the catch block can see it
      uploadedFileName = `tasks/${Date.now()}-optimized.webp`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uploadedFileName,
        Body: optimizedBuffer,
        ContentType: "image/webp"
      }));

      img_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadedFileName}`;
    }

    // Execution Layer 1: Run the raw SQL insertion service worker (passing dbClient)
    const savedTaskData = await insertNewTask(content, img_url, user_id, dbClient);
    if (!savedTaskData) throw new Error("Failed to persist task resource data");

    // Execution Layer 2: Run the profile mapping hydration service worker (passing dbClient)
    const resultWithUser = await fetchHydratedTaskById(savedTaskData.id, dbClient);

    // 🔒 FIXED STEP 1: Permanently commit your database records FIRST
    await dbClient.query("COMMIT");

    // =================================================================
    // 🧹 FIXED STEP 2: WILDCARD REDIS CACHE INVALIDATION BROOM SYSTEM
    // =================================================================
    try {
      if (user_uuid) {
        // ── A. Sweep out all paginated timeline cache snapshots from the Home Feed ──
        const homeFeedPattern = `tasks_feed:${user_uuid}:*`;
        const homeKeys = await redisClient.keys(homeFeedPattern);
        if (homeKeys.length > 0) {
          await redisClient.del(homeKeys);
          console.log(`🧹 Creation Cache Reset: Swept away ${homeKeys.length} home feed chunks.`);
        }

        // ── B. Sweep out all paginated timeline cache snapshots from the Private Feed ──
        const journalPattern = `journal_feed:${user_uuid}:*`;
        const journalKeys = await redisClient.keys(journalPattern);
        if (journalKeys.length > 0) {
          await redisClient.del(journalKeys);
          console.log(`🧹 Creation Cache Reset: Swept away ${journalKeys.length} private feed chunks.`);
        }
      }
    } catch (cacheErr) {
      console.error("⚠️ Non-critical Error in cache-busting during post creation:", cacheErr.message);
    }

    return res.json({
      message: "Content created successfully",
      newTask: resultWithUser,
    });
  } catch (err) {
    // EMERGENCY ROLLBACK BLOCK
    try {
      await dbClient.query("ROLLBACK");
    } catch (rbErr) {
      // Quietly swallow if the transaction client connection was already broken
    }

    // If we uploaded a new file to S3 but the DB failed, delete it immediately from storage
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
    // Crucial: Always release the database connection client back to the connection pool
    dbClient.release();
  }
};
