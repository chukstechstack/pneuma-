import pool from '../../../../Terminal/Supabase/supabaseConfig';

export const handleAddComment = async (contentId: number, payload: any) => {
    const { userUuid, content } = payload;
    if (!userUuid || !content) throw new Error("userUuid and content are required");

    const userRes = await pool.query(`SELECT id FROM profiles WHERE uuid = $1`, [userUuid]);
    if (userRes.rows.length === 0) throw new Error("User profile not found");
    const userId = userRes.rows[0].id;

    const newCommentRes = await pool.query(
        `INSERT INTO comments (content_id, user_id, content) 
         VALUES ($1, $2, $3) 
         RETURNING id, content, created_at;`,
        [contentId, userId, content]
    );

    return newCommentRes.rows[0];
};