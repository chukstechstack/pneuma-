import pool from "../../config/supabaseConfig.js";

export const  getComment  = async (req, res, next) => {
    const { contentUuid } = req.params;
    const freeze_time = req.query.freeze_time || String(Date.now());
    const fresh_load_pointer = req.query.fresh_load || "Yes_Is_FreshLoad";

    try {
        const checkContent = await pool.query("select id from content where uuid = $1", [contentUuid]);
        if (checkContent.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        const content_id = checkContent.rows[0].id;

        const freeze_Time_Date = new Date(Number(freeze_time));
        const queryParams = [content_id, freeze_Time_Date];

        let queryText = `
            SELECT 
                c.id,
                c.uuid,
                c.parent_id,
                c.comment_text,
                c.created_at, -- 🎯 FIXED: Changed create_at to created_at
                CONCAT(p.first_name, ' ', p.last_name) AS author_name,
                p.avatar_url -- 🎯 FIXED: Removed trailing comma right before FROM
            FROM comments c
            LEFT JOIN profiles p on c.user_id = p.id
            WHERE c.content_id = $1 AND c.created_at <= $2
        `;

        // 🎯 FIXED: Re-added the missing infinite scroll pointer append block for page 2, 3...
        if (fresh_load_pointer && fresh_load_pointer !== "Yes_Is_FreshLoad") {
            const last_comment_date = new Date(Number(fresh_load_pointer));
            queryText += ` AND c.created_at < $3`;
            queryParams.push(last_comment_date);
        }

        queryText += ` ORDER BY c.created_at DESC LIMIT 40`;

        const result = await pool.query(queryText, queryParams);
        const commentData = result.rows;

        let next_comment_timestamp = null;

        if (commentData.length === 40) {
            // 🎯 FIXED: Swapped commentsList with commentData, changed create_at to created_at
            const lastItem = commentData[commentData.length - 1];
            // 🎯 FIXED: Changed new Data() to new Date()
            next_comment_timestamp = new Date(lastItem.created_at).getTime();
        }

        return res.json({
            comments: commentData,
            next_comment_timestamp: next_comment_timestamp || null
        });

    } catch (err) {
        console.error(err.message);
        next(err);
    }
};
