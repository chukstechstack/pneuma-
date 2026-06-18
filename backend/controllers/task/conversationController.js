import pool from "../../config/supabaseConfig.js";

export const establishConversation = async (req, res, next) => {
    // 1. Grab both user IDs (assuming req.user.id is injected by your login middleware)
    const currentUserProfileId = req.user.id; 
    const { targetUserProfileId } = req.body;

    if (!targetUserProfileId) {
        return res.status(400).json({ error: "Target user ID is required" });
    }

    try {
        // 2. Run the strict 2-person room verification query
        const checkQuery = `
            SELECT conversation_id 
            FROM conversation_participants
            WHERE user_id IN ($1, $2)
            GROUP BY conversation_id
            HAVING COUNT(DISTINCT user_id) = 2
        `;
        
        const checkResult = await pool.query(checkQuery, [currentUserProfileId, targetUserProfileId]);

        // 3. Scenario A: Room already exists! Return it cleanly.
        if (checkResult.rows.length > 0) {
            return res.json({ conversationId: checkResult.rows[0].conversation_id });
        }

        // 4. Scenario B: First time talking. Start a secure database transaction to build a new room.
        await pool.query("BEGIN");

        // Step 1: Create the master conversation row
        const newRoomRes = await pool.query(
            "INSERT INTO conversations DEFAULT VALUES RETURNING id"
        );
        const newConversationId = newRoomRes.rows[0].id;

        // Step 2: Register User A (You) into the registry
        await pool.query(
            "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)",
            [newConversationId, currentUserProfileId]
        );

        // Step 3: Register User B (Them) into the registry
        await pool.query(
            "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)",
            [newConversationId, targetUserProfileId]
        );

        // Commit the transaction securely to the database
        await pool.query("COMMIT");

        // Return the brand-new room container ID to the frontend!
        return res.status(201).json({ conversationId: newConversationId });

    } catch (err) {
        // If anything fails during creation, cancel changes immediately to keep data clean
        await pool.query("ROLLBACK");
        console.error("Conversation creation failed:", err.message);
        next(err);
    }
};
