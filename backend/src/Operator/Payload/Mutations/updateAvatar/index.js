import pool from "@Terminal/Supabase/supabaseConfig.js";
import { processAndUploadAvatar, deleteAvatarFromS3 } from "./ImageService.ts.js";
import { executeAvatarDatabaseTransactions } from "./Queries.js";
import { invalidateAvatarCache } from "./Cache.js";
export const updateAvatar = async (req, res, next) => {
    const user_uuid = req.user?.uuid;
    const user_id = req.user?.id;
    if (user_id === undefined || user_uuid === undefined) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    let avatar_url = null;
    let uploadedFileName = null;
    const dbClient = await pool.connect();
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }
        await dbClient.query("BEGIN");
        // 1. Process & Upload Image via Service
        const uploadResult = await processAndUploadAvatar(req.file.buffer, user_uuid);
        avatar_url = uploadResult.avatarUrl;
        uploadedFileName = uploadResult.uploadedFileName;
        // 2. Execute DB Transactions via Queries file
        const updatedProfile = await executeAvatarDatabaseTransactions(dbClient, user_uuid, avatar_url, uploadResult.bufferLength);
        await dbClient.query("COMMIT");
        // 3. Redis Cache Invalidation
        await invalidateAvatarCache(user_uuid);
        return res.status(200).json({
            message: "Avatar updated successfully",
            avatar_url,
            profile: updatedProfile,
        });
    }
    catch (err) {
        try {
            await dbClient.query("ROLLBACK");
        }
        catch {
            // Quietly swallow if client already broken
        }
        if (uploadedFileName) {
            await deleteAvatarFromS3(uploadedFileName);
        }
        next(err);
    }
    finally {
        dbClient.release();
    }
};
//# sourceMappingURL=index.js.map