import TaskInputError from "../../utils/taskInputError.js";
import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"; // Added DeleteObjectCommand for rollback
import s3 from "../../config/AwsS3ClientConfig.js";
import redisClient from "../../config/redisCreateClient.js";
import pool from "../../config/supaseConfig.js"; // Imported the pool to manage connections

// Import your newly created database service workers
import { insertNewTask, fetchHydratedTaskById } from "../../services/task/createTaskService.js";

export const createTask = async (req, res, next) => {
  const { content } = req.body;
  const user_id = req.user.id;

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

    // Cache clearing execution
    await redisClient.del(`tasks_feed:${user_id}`);
    console.log(`🗑️ Cache busted for user: ${user_id}`);

    // If everything up to this point succeeds, permanently commit the database data
    await dbClient.query("COMMIT");

    return res.json({
      message: "Content created successfully",
      newTask: resultWithUser,
    });
  } catch (err) {
    // EMERGENCY ROLLBACK BLOCK
    // 1. Undo any database queries executed during this transaction
    await dbClient.query("ROLLBACK");

    // 2. If we uploaded a new file to S3 but the DB failed, delete it immediately from storage
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
