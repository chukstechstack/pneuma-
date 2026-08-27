import pool from "@/Terminal/Supabase/supabaseConfig.js";
import { fetchOldTaskImage, executeDynamicTaskUpdate } from "@/Workshop/Payload/Mutations/patchTaskService.js";
import type { Response, NextFunction } from "express";
import type { Pool, PoolClient } from "pg";
import type { Server } from "socket.io";

import type { AuthenticatedRequest, PatchTaskResponseData } from "./types.js";
import { broadcastTaskUpdate } from "./patchTaskSocket.js";
import { invalidatePatchCaches } from "./patchTaskCache.js";
import { uploadAndOptimizeImage, deleteImageFromS3 } from "./imageService.js"; // 👈 Adjust path

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
      // 1. Fetch and delete old image if it exists
      const oldImgRecord = await fetchOldTaskImage(uuid, user_id, dbClientAsPool);
      const oldImgUrl = oldImgRecord?.img;
      
      if (oldImgUrl) {
        try {
          await deleteImageFromS3(oldImgUrl);
        } catch {
          // Silently ignore malformed old image URLs and push forward
        }
      }

      // 2. Process and upload new image via utility
      const uploadResult = await uploadAndOptimizeImage(req.file.buffer, "tasks");
      newUrl = uploadResult.newUrl;
      uploadedFileName = uploadResult.uploadedFileName;
    }

    const updatedRows = await executeDynamicTaskUpdate(
      uuid,
      user_id,
      req.body.content,
      newUrl,
      dbClientAsPool
    ) as { rows: unknown[] } | null;

    if (!updatedRows) {
      await dbClient.query("ROLLBACK");
      dbClient.release();
      return res.status(400).json({ error: "No fields provided for update" });
    }

    await dbClient.query("COMMIT");

    // 🚀 Isolated Socket Broadcast
    const io: Server | undefined = req.app.get("socketio");
    await broadcastTaskUpdate(io, uuid, updatedRows);

    // 🧹 Isolated Redis Cache Invalidation
    if (user_uuid) {
      await invalidatePatchCaches(user_uuid);
    }

    const responseData: PatchTaskResponseData = {
      message: "Task updated successfully",
      updatedTask: updatedRows
    };

    return res.json(responseData);

  } catch (err) {
    try {
      await dbClient.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }

    // Rollback newly uploaded S3 file if transaction failed
    if (uploadedFileName) {
      try {
        await deleteImageFromS3(uploadedFileName);
      } catch (s3DeleteErr) {
        console.error("Critical: Failed to clean up orphan S3 asset during rollback:", s3DeleteErr);
      }
    }

    next(err);
  } finally {
    dbClient.release();
  }
};