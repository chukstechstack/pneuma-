import redisClient from "../../config/redisCreateClient.js";
import pool from "../../config/supabaseConfig.js";
export const acceptFollowRequest = async (req, res, next) => {
    const following_numeric_id = req.user?.id;
    const { followedUserUuid } = req.params;

    if (!followedUserUuid) {
        return res.status(400).json({ error: "Target profile UUID is required" })
    }


    const dbClient = await pool.connect();
    try {
        await dbClient.query("BEGIN");
        const profileRes = await dbClient.query(` select id from profiles where uuid  = $1`, [followedUserUuid]);
        if (profileRes.rows.length === 0) {
            await dbClient.query("ROLLBACK");
            return res.status(404).json({ error: "Stranger Ppofile not found" })
        }

        const follower_numeric_id = profileRes.rows[0].id;
        const update_Relation_Res = await dbClient.query(`update follows SET status = 'active' WHERE follower_id = $1 AND following_id = $2 AND status = 'pending' RETURNING id`,
            [follower_numeric_id, following_numeric_id]);
        if (update_Relation_Res.rows.length === 0) {

            await dbClient.query('ROLLBACK');
            return res.status(400).json({ error: "No pending follow request found to accept" });
        }
        // for who is th follower increase its following count
        await dbClient.query(`update profiles SET following_count = COALESCE(following_count, 0) + 1 WHERE id = $1`,
            [follower_numeric_id]);


        // for who they are following increase its followers count
        await dbClient.query(
            `UPDATE profiles SET followers_count = COALESCE(followers_count, 0) + 1 WHERE id = $1`,
            [following_numeric_id]
        );

        await dbClient.query("COMMIT");

        // 4. Send the successful verification payload back to React
        return res.json({
            message: "Follow request accepted successfully!",
            status: "active"
        });

    } catch (err) {
        await dbClient.query("ROLLBACK");
        console.error("❌ Error in acceptFollowRequest:", err.message);
        next(err);
    } finally {
        dbClient.release();
    }

}