import pool from "../../../config/supabaseConfig.js";
import redisClient from "../../../config/redisCreateClient.js";

export const removeConnection = async (req, res, next) => {
    const userId = req.user?.id;
    const userUuid = req.user?.uuid;
    const { targetUuid } = req.body;

    if (!targetUuid || !userId) {
        return res.status(400).json({ error: "Missing required identification" });
    }

    const dbClient = await pool.connect();
    try {
        await dbClient.query("BEGIN");


        const targetRes = await dbClient.query("SELECT id FROM profiles WHERE uuid = $1", [targetUuid]);
        if (targetRes.rows.length === 0) {
            await dbClient.query("ROLLBACK");
            return res.status(404).json({ error: "Target user not found" });
        }
        const targetId = targetRes.rows[0].id;
        const deleteRes = await dbClient.query(
            `DELETE FROM follows 
             WHERE (follower_id = $1::integer AND following_id = $2::integer) 
                OR (follower_id = $2::integer AND following_id = $1::integer)
             RETURNING follower_id, following_id`,
            [userId, targetId]
        );

        if (deleteRes.rows.length === 0) {
            await dbClient.query("ROLLBACK");
            return res.status(400).json({ error: "No active connection found to remove" });
        }

        await dbClient.query(
            "UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = $1::integer",
            [userId]
        );

        await dbClient.query(
            "UPDATE profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = $1::integer",
            [targetId]
        );

        try {
            await redisClient.del(`tasks_feed:${userUuid}:*`);
            await redisClient.del(`profile_feed:${userId}:*`);
            await redisClient.del(`tasks_feed:${targetUuid}:*`);
            await redisClient.del(`profile_feed:${targetId}:*`);
        } catch (cacheErr) {
            console.error("Cache clear failed", cacheErr);
        }

        await dbClient.query("COMMIT");

        const io = req.app.get("socketio");
        io.to(`current_Logged_In_User_Uuid:${targetUuid}`).emit("connection_removed", {
            removedBy: userUuid
        });

        return res.json({ message: "Connection removed successfully" });
    } catch (err) {
        await dbClient.query("ROLLBACK");
        next(err);
    } finally {
        dbClient.release();
    }
};

