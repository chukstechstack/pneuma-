import redisClient from "../../../config/redisCreateClient.js";
import pool from "../../../config/supabaseConfig.js";

export const commentFeed = async (req, res, next) => {
    const { contentUuid } = req.params;
    const { comment_text } = req.body;
    const user_id = req.user.id;

    const dbClient = await pool.connect();

    try {
        await dbClient.query("BEGIN");
        if (!comment_text || comment_text.trim() === "") { throw new Error("Add a comment") };

        const checkContent = await dbClient.query("select id from content WHERE uuid = $1", [contentUuid]);

        if (checkContent.rows.length === 0) {
            await dbClient.query("ROLLBACK");
            dbClient.release();
            return res.status(404).json({ error: "journal post not found " });
        }

        const content_id = checkContent.rows[0].id;

        const insertQuery = `INSERT INTO  comments (content_id, user_id, comment_text) 
        values($1, $2, $3) 
        RETURNING id, uuid, content_id, parent_id, comment_text, created_at;`;
        const result = await dbClient.query(insertQuery, [content_id, user_id, comment_text]);

        const newComment = result.rows[0];
        const profileUser = await dbClient.query("SELECT CONCAT(first_name, ' ', last_name) As author_name, avatar_url FROM profiles WHERE ID = $1", [user_id]);

        const authorProfile = profileUser.rows[0];
        await dbClient.query("COMMIT");
        dbClient.release();


        const responsePayload = {
            ...newComment,
            author_name: authorProfile.author_name,
            avatar_url: authorProfile.avatar_url
        }
        return res.status(201).json(responsePayload)
    }
    catch (err) {
        await dbClient.query("ROLLBACK");
        dbClient.release();
        console.log(err.message);
        if (err.message === "Add a comment") {
            return res.status(400).json({ error: err.message })
        }
        next(err);
    }

}