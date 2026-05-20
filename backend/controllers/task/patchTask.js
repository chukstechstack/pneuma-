import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../config/AwsS3ClientConfig.js";
import redisClient from "../../config/redisCreateClient.js";
import pool from "../../config/supaseConfig.js"; // Import your pool to manage connections
import { fetchOldTaskImage, executeDynamicTaskUpdate } from "../../services/task/patchTaskService.js";

export const patchTask = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;

  let newUrl = null;
  let uploadedFileName = null; // Track file name for S3 emergency rollback
  const dbClient = await pool.connect(); // Checkout a single database client connection

  try {
    // Start database transaction block
    await dbClient.query("BEGIN");

    if (req.file) {
      const oldImgRecord = await fetchOldTaskImage(uuid, user_id);
      const oldImgUrl = oldImgRecord?.img;
      const operations = [];

      if (oldImgUrl) {
        try {
          const parsedUrl = new URL(oldImgUrl);
          const filePath = parsedUrl.pathname.substring(1);

          operations.push(s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePath
          })));
        } catch (urlErr) {
          console.error("Failed to parse old image URL for deletion:", urlErr);
        }
      }

      const optimizePromise = sharp(req.file.buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      operations.push(optimizePromise);
      await Promise.all(operations);
      const optimizedBuffer = await optimizePromise;

      // Track the name before uploading so the catch block can see it
      uploadedFileName = `tasks/${Date.now()}-optimized.webp`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uploadedFileName,
        Body: optimizedBuffer,
        ContentType: "image/webp"
      }));

      newUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadedFileName}`;
    }

    // Pass the active dbClient transaction into your service worker
    const finalUpdateResult = await executeDynamicTaskUpdate(uuid, user_id, req.body.content, newUrl, dbClient);

    if (!finalUpdateResult) {
      await dbClient.query("ROLLBACK");
      return res.status(400).json({ error: "No fields provided for update" });
    }

    if (finalUpdateResult.rowCount === 0) {
      await dbClient.query("ROLLBACK");
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    // Flush cache
    await redisClient.del(`tasks_feed:${user_id}`);

    // If everything up to this point succeeds, permanently commit the database data
    await dbClient.query("COMMIT");

    return res.json({
      message: "Task updated successfully",
      updatedTask: finalUpdateResult.rows[0]
    });

  } catch (err) {
    // EMERGENCY ROLLBACK BLOCK
    // 1. Undo any database queries executed during this request
    await dbClient.query("ROLLBACK");

    // 2. If we uploaded a new file to S3 but the DB failed, delete it immediately
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
