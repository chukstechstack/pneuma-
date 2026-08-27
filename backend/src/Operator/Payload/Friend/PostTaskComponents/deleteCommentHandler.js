import pool from '../../../../Terminal/Supabase/supabaseConfig';
export const handleDeleteComment = async (payload) => {
    const { commentId } = payload;
    if (!commentId)
        throw new Error("commentId is required");
    await pool.query(`DELETE FROM comments WHERE id = $1;`, [commentId]);
    return true;
};
//# sourceMappingURL=deleteCommentHandler.js.map