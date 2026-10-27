import TaskInputError from "@Toolkits/Input/taskInputError.js";
import pool from "@Terminal/Supabase/supabaseConfig.js";
// 2. Services & Utilities
import { insertNewTask, fetchHydratedTaskById, createConnectionAlertsForTask } from "@/Workshop/Payload/Mutations/createTaskService.js";
import { processAndUploadImage, deleteStoredImage } from "./imageUploadUtility.js";
import { broadcastNewPost } from "./Socket.js";
import { invalidateAllTaskCaches } from "./Cache.js";
export const createTask = async (req, res, next) => {
    const content = req.body.content;
    const user_uuid = req.user?.uuid;
    const user_id = req.user?.id;
    if (user_id === undefined || user_id === null || !user_uuid) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    let img_url = null;
    let uploadedFileName = null;
    const dbClient = await pool.connect();
    try {
        if (!content) {
            throw new TaskInputError("Content is required");
        }
        await dbClient.query("BEGIN");
        // Convert images to WebP before saving them in Supabase Storage.
        if (req.file) {
            const uploadResult = await processAndUploadImage(req.file.buffer, "tasks");
            img_url = uploadResult.imgUrl;
            uploadedFileName = uploadResult.uploadedFileName;
        }
        const savedTaskData = await insertNewTask(content, img_url, user_id, dbClient);
        if (!savedTaskData) {
            throw new Error("Failed to persist task resource data");
        }
        const resultWithUser = await fetchHydratedTaskById(savedTaskData.id, dbClient);
        // Fan out alerts to inner circle connections
        await createConnectionAlertsForTask(user_uuid, savedTaskData.id, dbClient);
        await dbClient.query("COMMIT");
        // 🚀 Socket broadcast
        const io = req.app.get("socketio");
        await broadcastNewPost(io, dbClient, user_uuid, savedTaskData.id);
        // 🧹 Redis cache invalidation
        if (user_uuid) {
            await invalidateAllTaskCaches();
        }
        const responseData = {
            message: "Content created successfully",
            newTask: resultWithUser,
        };
        return res.json(responseData);
    }
    catch (err) {
        try {
            await dbClient.query("ROLLBACK");
        }
        catch {
            // Quietly swallow if client was already broken
        }
        if (uploadedFileName) {
            try {
                await deleteStoredImage(uploadedFileName);
            }
            catch (cleanupError) {
                console.error("Failed to clean up uploaded task image after create failure:", cleanupError);
            }
        }
        next(err);
    }
    finally {
        dbClient.release();
    }
};
//# sourceMappingURL=index.js.map