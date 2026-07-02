import pool from "../../config/supabaseConfig.js";

export const establishConversation = async (req, res, next) => {
    const currentUserProfileId = req.user.id;
    const { targetUserProfileId } = req.body;

    if (!targetUserProfileId) {
        return res.status(400).json({ error: "Target user ID is required" });
    }

    try {
        const checkQuery = `
            SELECT conversation_id 
            FROM conversation_participants
            WHERE user_id IN ($1, $2)
            GROUP BY conversation_id
            HAVING COUNT(DISTINCT user_id) = 2
        `;

        const checkResult = await pool.query(checkQuery, [currentUserProfileId, targetUserProfileId]);


        if (checkResult.rows.length > 0) {
            return res.json({ conversationId: checkResult.rows[0].conversation_id });
        }

        await pool.query("BEGIN");


        const newRoomRes = await pool.query(
            "INSERT INTO conversations DEFAULT VALUES RETURNING id"
        );
        const newConversationId = newRoomRes.rows[0].id;

        await pool.query(
            "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)",
            [newConversationId, currentUserProfileId]
        );

        await pool.query(
            "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)",
            [newConversationId, targetUserProfileId]
        );

        await pool.query("COMMIT");
        return res.status(201).json({ conversationId: newConversationId });

    } catch (err) {
        await pool.query("ROLLBACK");
        console.error("Conversation creation failed:", err.message);
        next(err);
    }
};
