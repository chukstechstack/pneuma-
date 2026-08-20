import pool from '../../../../Terminal/Supabase/supabaseConfig';

export const handleToggleLike = async (contentId: number, payload: any) => {
    const { userUuid } = payload;
    if (!userUuid) throw new Error("userUuid is required");

    const userRes = await pool.query(`SELECT id FROM profiles WHERE uuid = $1`, [userUuid]);
    if (userRes.rows.length === 0) throw new Error("User profile not found");
    const userId = userRes.rows[0].id;

    // Check if user already liked
    const existing = await pool.query(
        `SELECT id FROM interactions WHERE user_id = $1 AND content_id = $2 AND interaction_type = 'like'`,
        [userId, contentId]
    );

    if (existing.rows.length > 0) {
        await pool.query(
            `DELETE FROM interactions WHERE user_id = $1 AND content_id = $2 AND interaction_type = 'like'`,
            [userId, contentId]
        );
    } else {
        await pool.query(
            `INSERT INTO interactions (user_id, content_id, interaction_type) VALUES ($1, $2, 'like')`,
            [userId, contentId]
        );
    }

    const countRes = await pool.query(
        `SELECT COUNT(*)::INT AS total FROM interactions WHERE content_id = $1 AND interaction_type = 'like'`,
        [contentId]
    );

    return {
        likesCount: countRes.rows[0].total,
        isLiked: existing.rows.length === 0
    };
};