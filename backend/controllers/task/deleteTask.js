import s3 from "../../config/AwsS3ClientConfig.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import redisClient from "../../config/redisCreateClient.js";
import pool from "../../config/supabaseConfig.js"; // 1. Imported your database pool configuration

// Import your newly created service infrastructure
import { findTaskImageForCleanup, executeTaskDeletion } from "../../services/task/deleteTaskService.js";

export const deleteTask = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;

  // 2. Checkout a single isolated client connection from the pool
  const dbClient = await pool.connect();

  try {
    // 3. Start safe database isolation transaction layer
    await dbClient.query("BEGIN");

    // Execution Layer 1: Query the image data passing your explicit dbClient as the 3rd argument
    const taskRecord = await findTaskImageForCleanup(uuid, user_id, dbClient);
    if (!taskRecord) {
      await dbClient.query("ROLLBACK");
      return res.status(403).json({ error: "You are unauthorized or task not found" });
    }

    // Execution Layer 2: Run physical row deletion passing your explicit dbClient as the 3rd argument
    const deletedCount = await executeTaskDeletion(uuid, user_id, dbClient);
    if (deletedCount === 0) {
      await dbClient.query("ROLLBACK");
      return res.status(403).json({ error: "You are unauthorized" });
    }

    // 4. Permanently seal database updates and immediately return connection to pool
    await dbClient.query("COMMIT");
 

    // 5. ASYNC BACKGROUND CLEANUP LAYER (Using your clean native URL Web API approach)
    const imgUrl = taskRecord.img;
    if (imgUrl) {
      try {
        const parsedUrl = new URL(imgUrl);
        const filePath = parsedUrl.pathname.substring(1); // Strips the leading "/" cleanly

        if (filePath) {
          // Fire and forget in the background so it doesn't cause lagging response latency
          s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePath
          })).then(() => console.log(`AWS S3 cleanup success: ${filePath}`))
             .catch(err => console.error(`⚠️ S3 background cleanup failed for ${filePath}:`, err));
        }
      } catch (urlError) {
        console.error("⚠️ Malformed image URL found during cleanup phase:", urlError.message);
      }
    }

    // 6. Redis Cache Invalidation Pipeline
    const cacheKey = `tasks_feed:${user_id}`;
    await redisClient.del(cacheKey).catch(err => console.error("Redis clear error:", err));
    console.log("🗑️ Redis Cache cleared for user:", user_id);

    return res.status(200).json({ message: "Deleted successfully" });

  } catch (err) {
    // EMERGENCY ROLLBACK BLOCK
    try {
      await dbClient.query("ROLLBACK");
    } catch (rollbackErr) {
      // Quietly ignore if transaction wasn't actively processing queries
    }
    console.error(err);
    return next(err);
  } finally {
    // Crucial Guard: Always guarantee connection client is released back to connection pool
    dbClient.release();
  }
};
