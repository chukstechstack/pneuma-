import pool from "../../config/supabaseConfig.js";

export const getSmartProfileFeed = async (req, res, next) => {
    const loggedInUserProfileId = req.user?.id; // You (The person viewing)
    const { targetProfileUuid } = req.params;   // The profile being viewed

    if (!targetProfileUuid) {
        return res.status(400).json({ error: "Target profile UUID is required" });
    }

    try {
        // Step 1: Find the target profile details from the database
        const profileRes = await pool.query(
            `SELECT id, uuid, username, first_name, last_name, avatar_url, 
            followers_count, following_count, created_at 
             FROM profiles WHERE uuid = $1`,
            [targetProfileUuid]
        );

        if (profileRes.rows.length === 0) {
            return res.status(404).json({ error: "Sanctuary profile not found" });
        }

        const targetProfileData = profileRes.rows[0];
        const targetProfileNumericId = targetProfileData.id;

        // Determine if the viewer is the absolute owner of this profile
        const isOwner = loggedInUserProfileId === targetProfileNumericId;

        // We will add the relationship check and the 5-post filter right below this!
        let relationStatus = null;
        let visibleTasks = [];

        if (!isOwner) {
            const followCheck = await pool.query(`SELECT status FROM follows WHERE follower_id = $1 AND following_id = $2`,
                [loggedInUserProfileId, targetProfileNumericId]
            );

            if (followCheck.rows.length > 0) {
                relationStatus = followCheck.rows[0].status
            }
        }

        if (isOwner || relationStatus === 'active') {
            const taskRes = await pool.query(`
        SELECT id, uuid, title, content, img, created_at, likes_count, reposts_count
        FROM content
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 5
        `, [targetProfileNumericId]);
            visibleTasks = taskRes.rows;
        }

        return res.json({
            profile: targetProfileData,
            isOwner,
            relationStatus,
            tasks: visibleTasks
        })


    } catch (err) {
        console.error("❌ Error inside getSmartProfileFeed:", err.message);
        next(err);
    }
};