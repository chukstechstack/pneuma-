import pool from "../../../config/supabaseConfig.js";
export const fetch_Journal_When_Accepted = async (req, res) => {
    const { targetProfileUuid } = req.params;
    // ... logic to check auth (is status active?) ...
    const taskRes = await pool.query(`
        SELECT id, uuid, title, content, img, created_at 
        FROM content WHERE user_id = (SELECT id FROM profiles WHERE uuid = $1)
        ORDER BY created_at DESC LIMIT 5`, [targetProfileUuid]);

    res.json({ tasks: taskRes.rows });
}