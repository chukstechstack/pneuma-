import pool from "@/Terminal/Supabase/supabaseConfig.js";
import { fetchOldTaskImage, executeDynamicTaskUpdate } from "@/Workshop/Payload/Mutations/patchTaskService.js";
import { broadcastTaskUpdate } from "./patchTaskSocket.js";
import { invalidatePatchCaches } from "./patchTaskCache.js";
import { uploadAndOptimizeImage, deleteStoredImage } from "./imageService.js";
export const patchTask = async (req, res, next) => {
    const user_id = req.user?.id;
    const user_uuid = req.user?.uuid;
    const { uuid } = req.params;
    if (user_id === undefined || user_id === null) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    let newUrl = null;
    let uploadedFileName = null;
    let oldImgUrl;
    const dbClient = await pool.connect();
    const dbClientAsPool = dbClient;
    try {
        await dbClient.query("BEGIN");
        if (req.file) {
            // Fetch the old image URL for cleanup after the database update.
            const oldImgRecord = await fetchOldTaskImage(uuid, user_id, dbClientAsPool);
            oldImgUrl = oldImgRecord?.img;
            // Process and upload the new image before updating the task.
            const uploadResult = await uploadAndOptimizeImage(req.file.buffer, "tasks");
            newUrl = uploadResult.newUrl;
            uploadedFileName = uploadResult.uploadedFileName;
        }
        const updatedRows = await executeDynamicTaskUpdate(uuid, user_id, req.body.content, newUrl, dbClientAsPool);
        if (!updatedRows) {
            await dbClient.query("ROLLBACK");
            if (uploadedFileName) {
                try {
                    await deleteStoredImage(uploadedFileName);
                }
                catch (cleanupError) {
                    console.error("Failed to clean up task image after rejected update:", cleanupError);
                }
            }
            return res.status(400).json({ error: "No fields provided for update" });
        }
        await dbClient.query("COMMIT");
        if (oldImgUrl) {
            try {
                await deleteStoredImage(oldImgUrl);
            }
            catch (cleanupError) {
                console.error("Failed to remove replaced task image from Supabase Storage:", cleanupError);
            }
        }
        // 🚀 Isolated Socket Broadcast
        const io = req.app.get("socketio");
        await broadcastTaskUpdate(io, uuid, updatedRows);
        // 🧹 Isolated Redis Cache Invalidation
        if (user_uuid) {
            await invalidatePatchCaches(user_uuid);
        }
        const responseData = {
            message: "Task updated successfully",
            updatedTask: updatedRows
        };
        return res.json(responseData);
    }
    catch (err) {
        try {
            await dbClient.query("ROLLBACK");
        }
        catch (rollbackErr) {
            console.error("Rollback failed:", rollbackErr);
        }
        // Roll back the uploaded object if the database update fails.
        if (uploadedFileName) {
            try {
                await deleteStoredImage(uploadedFileName);
            }
            catch (cleanupError) {
                console.error("Failed to clean up task image after update failure:", cleanupError);
            }
        }
        next(err);
    }
    finally {
        dbClient.release();
    }
};
//# sourceMappingURL=index.js.map