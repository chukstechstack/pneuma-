import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@Terminal/Aws/AwsS3ClientConfig.js";
import redisClient from "@Terminal/Redis/redisCreateClient.js";
import pool from "@Terminal/Supabase/supabaseConfig.js";
import type { Request, Response, NextFunction } from "express";
import type { PoolClient } from "pg";

interface AuthenticatedRequest extends Request {
  user?: {
    id?: number | string;
    uuid?: string;
  };
}

export const updateAvatar = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user_uuid = req.user?.uuid;
  const user_id = req.user?.id;

  if (user_id === undefined || user_uuid === undefined) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let avatar_url: string | null = null;
  let uploadedFileName: string | null = null;
  const dbClient: PoolClient = await pool.connect();

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    await dbClient.query("BEGIN");

    // 1. Sharp optimization: Square crop for profile avatars, high quality WebP
    const optimizedBuffer = await sharp(req.file.buffer)
      .resize({ width: 400, height: 400, fit: "cover", position: "entropy" })
      .webp({ quality: 85 })
      .toBuffer();

    uploadedFileName = `avatars/${user_uuid}/${Date.now()}-avatar.webp`;

    // 2. Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uploadedFileName,
        Body: optimizedBuffer,
        ContentType: "image/webp",
        CacheControl: "max-age=31536000",
      })
    );

    console.log("⚙️ [Backend] AWS Config Check:", {
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION
    });

    // Safely construct URL avoiding template corruption
    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    avatar_url = `https://${bucketName}.s3.${region}.amazonaws.com/${uploadedFileName}`;
    
    console.log("🔗 [Backend] Explicitly Built Avatar URL:", avatar_url);

    // 3. Optional: Insert into dedicated user_avatars history table
    await dbClient.query(
      `UPDATE user_avatars SET is_active = FALSE WHERE profile_uuid = $1`,
      [user_uuid]
    );

    await dbClient.query(
      `INSERT INTO user_avatars (profile_uuid, image_url, file_size, mime_type, is_active)
       VALUES ($1, $2, $3, $4, TRUE)`,
      [user_uuid, avatar_url, optimizedBuffer.length, "image/webp"]
    );

    // 4. Update the main profiles table for fast access across your app
    const updateProfileResult = await dbClient.query(
      `UPDATE profiles SET avatar_url = $1 WHERE uuid = $2 RETURNING *`,
      [avatar_url, user_uuid]
    );

    if (updateProfileResult.rows.length === 0) {
      throw new Error("Profile not found for avatar update");
    }

    await dbClient.query("COMMIT");

    // 5. Redis Cache Invalidation: Clear profile cache so feeds/navbar pick up the new photo
    try {
      const profileCachePattern = `profile:*:${user_uuid}*`;
      const cacheKeys = await redisClient.keys(profileCachePattern);
      if (cacheKeys.length > 0) {
        await redisClient.del(cacheKeys);
        console.log(`🧹 Avatar Cache Reset: Cleared ${cacheKeys.length} profile cache chunks.`);
      }
    } catch (cacheErr: unknown) {
      const cacheErrMsg = cacheErr instanceof Error ? cacheErr.message : String(cacheErr);
      console.error("⚠️ Non-critical Cache Clearing Error during avatar update:", cacheErrMsg);
    }

    return res.status(200).json({
      message: "Avatar updated successfully",
      avatar_url,
      profile: updateProfileResult.rows[0],
    });

  } catch (err: unknown) {
    try {
      await dbClient.query("ROLLBACK");
    } catch {
      // Quietly swallow if client already broken
    }

    // Clean up S3 orphan file if DB transaction failed
    if (uploadedFileName) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uploadedFileName,
          })
        );
        console.log(`Successfully cleaned up orphan S3 avatar file: ${uploadedFileName}`);
      } catch (s3DeleteErr: unknown) {
        const s3DeleteErrMsg = s3DeleteErr instanceof Error ? s3DeleteErr.message : String(s3DeleteErr);
        console.error("Critical: Failed to clean up orphan S3 avatar asset:", s3DeleteErrMsg);
      }
    }

    next(err);
  } finally {
    dbClient.release();
  }
};