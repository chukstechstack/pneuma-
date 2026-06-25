import redisClient from "../../config/redisCreateClient.js";
import pool from "../../config/supabaseConfig.js";
export const acceptFollowRequest = async (req, res, next) => {
    const following_numeric_id = req.user?.id;
    const { followerUuid, action } = req.body;

    if (!followerUuid || !action) {
        return res.status(400).json({ error: "Target profile UUID is required" })
    }


    const dbClient = await pool.connect();
    try {
        await dbClient.query("BEGIN");

        const profileRes = await dbClient.query(` select id from profiles where uuid  = $1`, [followerUuid]);
        if (profileRes.rows.length === 0) {
            await dbClient.query("ROLLBACK");
            return res.status(404).json({ error: "Stranger Ppofile not found" })
        }

        const follower_numeric_id = profileRes.rows[0].id;

        if (action === 'accept') {
            // 🟢 1. Execute your existing UPDATE queries here
            const update_Relation_Res = await dbClient.query(
                `UPDATE follows SET status = 'active' WHERE follower_id = $1 AND following_id = $2 AND status = 'pending' RETURNING id`,
                [follower_numeric_id, following_numeric_id]
            );

            if (update_Relation_Res.rows.length === 0) {
                await dbClient.query('ROLLBACK');
                return res.status(400).json({ error: "No pending follow request found to accept" });
            }

            // 🟢 2. Increment counters
            await dbClient.query(`UPDATE profiles SET following_count = COALESCE(following_count, 0) + 1 WHERE id = $1`, [follower_numeric_id]);
            await dbClient.query(`UPDATE profiles SET followers_count = COALESCE(followers_count, 0) + 1 WHERE id = $1`, [following_numeric_id]);

        } else if (action === 'decline') {
            // 🔴 3. Execute a DELETE query for decline
            const delete_Relation_Res = await dbClient.query(
                `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 AND status = 'pending' RETURNING id`,
                [follower_numeric_id, following_numeric_id]
            );

            if (delete_Relation_Res.rows.length === 0) {
                await dbClient.query('ROLLBACK');
                return res.status(400).json({ error: "No pending follow request found to decline" });
            }
        } else {
            await dbClient.query('ROLLBACK');
            return res.status(400).json({ error: "Invalid action type" });
        }

        await dbClient.query("COMMIT");


        try {
            if (action === 'accept' && followerUuid) {
                const followerHomePattern = `tasks_feed:${followerUuid}:*`;
                const followerKeys = await redisClient.keys(followerHomePattern);
                if (followerKeys.length > 0) {
                    await redisClient.del(followerKeys);
                    console.log(`🧹 Swept ${followerKeys.length} feed chunks for follower.`);
                }
            }

            if (action === 'accept' && following_numeric_id) {
                const authorPattern = `profile_feed:${following_numeric_id}:*`;
                const authorKeys = await redisClient.keys(authorPattern);
                if (authorKeys.length > 0) {
                    await redisClient.del(authorKeys);
                }
            }
        } catch (cacheErr) {
            console.error("⚠️ Non-critical follow approval cache clear failure:", cacheErr.message);
        }
        // 4. Send the successful verification payload back to React
        return res.json({
            message: `Follow request ${action}ed successfully!`,
            status: action === 'accept' ? 'active' : null,
            action: action
        });

        // Inside your controller after the database update:


        // Emit the update to the target user (the one who sent the request)
        req.io.to(`user_${targetUserId}`).emit("connection_status_updated", {
            AuthorUuid: currentUserId, // The person who accepted
            newStatus: 'active'
        });
    } catch (err) {
        await dbClient.query("ROLLBACK");
        console.error("❌ Error in acceptFollowRequest:", err.message);
        next(err);
    } finally {
        dbClient.release();
    }

}