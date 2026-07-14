import pool from "../../../config/supabaseConfig.js";
export const getSmartProfileFeed = async (req, res, next) => {
    const loggedInUserProfileId = req.user?.id;
    const { targetProfileUuid } = req.params;

    if (!loggedInUserProfileId) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        let profileRes;

        if (targetProfileUuid && targetProfileUuid !== "undefined" && targetProfileUuid !== "me") {
            profileRes = await pool.query(
                `SELECT id, uuid, username, first_name, last_name, avatar_url, created_at 
                 FROM profiles WHERE uuid = $1`,
                [targetProfileUuid]
            );
        } else {
            profileRes = await pool.query(
                `SELECT id, uuid, username, first_name, last_name, avatar_url, created_at 
                 FROM profiles WHERE id = $1`,
                [loggedInUserProfileId]
            );
        }

        if (profileRes.rows.length === 0) {
            return res.status(404).json({ error: "Sanctuary profile not found" });
        }

        const targetProfileData = profileRes.rows[0];
        const targetProfileNumericId = targetProfileData.id;
        const isOwner = loggedInUserProfileId === targetProfileNumericId;

        let relationStatus = null;
        let visibleTasks = [];


        if (!isOwner) {
            const followCheck = await pool.query(
                `SELECT status 
         FROM follows 
         WHERE (
             (follower_id = $1 AND following_id = $2) 
             OR 
             (follower_id = $2 AND following_id = $1)
         ) 
         AND status = 'active'
         LIMIT 1`,
                [loggedInUserProfileId, targetProfileNumericId]
            );

            if (followCheck.rows.length > 0) {
                relationStatus = 'active';
            }
        }


        if (isOwner || relationStatus === 'active') {
            const taskRes = await pool.query(`
                SELECT id, uuid, content, img, created_at
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
        });

    } catch (err) {
        console.error("❌ Error inside getSmartProfileFeed:", err.message);
        next(err);
    }
};