import pool from "../../../config/supabaseConfig.js";
import redisClient from "../../../config/redisCreateClient.js";
export const acceptFollowRequest = async (req, res, next) => {
    const following_numeric_id = req.user?.id;
    const { followerUuid, action } = req.body;

    if (!followerUuid || !action) return res.status(400).json({ error: "Missing data" });

    const dbClient = await pool.connect();
    try {
        await dbClient.query("BEGIN");

        const profileRes = await dbClient.query("SELECT id FROM profiles WHERE uuid = $1", [followerUuid]);
        if (profileRes.rows.length === 0) {
            await dbClient.query("ROLLBACK");
            return res.status(404).json({ error: "User not found" });
        }

        const follower_numeric_id = profileRes.rows[0].id;

        if (action === 'accept') {
            const update_Relation_Res = await dbClient.query(
                "UPDATE follows SET status = 'active' WHERE follower_id = $1 AND following_id = $2 AND status = 'pending' RETURNING id",
                [follower_numeric_id, following_numeric_id]
            );

            if (update_Relation_Res.rows.length === 0) {
                await dbClient.query('ROLLBACK');
                return res.status(400).json({ error: "No pending request" });
            }

            await dbClient.query("UPDATE profiles SET following_count = following_count + 1 WHERE id = $1", [follower_numeric_id]);
            await dbClient.query("UPDATE profiles SET followers_count = followers_count + 1 WHERE id = $1", [following_numeric_id]);
        } else {
            await dbClient.query("DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'", [follower_numeric_id, following_numeric_id]);
        }


        try {
            await redisClient.del(`tasks_feed:${followerUuid}:*`);
            await redisClient.del(`profile_feed:${following_numeric_id}:*`);
        } catch (cacheErr) { console.error("Cache clear failed", cacheErr); }

        await dbClient.query("COMMIT");
        if (action === 'accept') {
            const io = req.app.get("socketio");

            io.to(`current_Logged_In_User_Uuid:${followerUuid}`).emit("connection_updated");
            io.to(`current_Logged_In_User_Uuid:${req.user.uuid}`).emit("connection_updated");
            io.to(`current_Logged_In_User_Uuid:${followerUuid}`).emit("connection_status_updated", { authorUuid: req.user.uuid, newStatus: 'active' });
        }

        return res.json({ message: "Success", status: action === 'accept' ? 'active' : null });
    } catch (err) {
        await dbClient.query("ROLLBACK");
        next(err);
    } finally {
        dbClient.release();
    }
};