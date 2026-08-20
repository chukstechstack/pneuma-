import pool from '../../../../Terminal/Supabase/supabaseConfig';

export const handleToggleShare = async (contentId: number, payload: any) => {
    const { userUuid } = payload;
    if (!userUuid) throw new Error("userUuid is required");

    const userRes = await pool.query(`SELECT id FROM profiles WHERE uuid = $1`, [userUuid]);
    if (userRes.rows.length === 0) throw new Error("User profile not found");
    const userId = userRes.rows[0].id;

    const existing = await pool.query(
        `SELECT id FROM interactions WHERE user_id = $1 AND content_id = $2 AND interaction_type = 'share'`,
        [userId, contentId]
    );

    if (existing.rows.length > 0) {
        await pool.query(
            `DELETE FROM interactions WHERE user_id = $1 AND content_id = $2 AND interaction_type = 'share'`,
            [userId, contentId]
        );
    } else {
        await pool.query(
            `INSERT INTO interactions (user_id, content_id, interaction_type) VALUES ($1, $2, 'share')`,
            [userId, contentId]
        );
    }

    const countRes = await pool.query(
        `SELECT COUNT(*)::INT AS total FROM interactions WHERE content_id = $1 AND interaction_type = 'share'`,
        [contentId]
    );

    return {
        sharesCount: countRes.rows[0].total,
        isShared: existing.rows.length === 0
    };
};