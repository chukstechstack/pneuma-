import pool from "@/Terminal/Supabase/supabaseConfig.js";
import { getErrorMessage } from "../../Toolkit/GetErrorMessage/getErrorMessage";
export const fetchConversation = async (req, res) => {
    try {
        const currentUserUuid = req.user?.uuid || req.query.currentUserId;
        const { recipientUuid } = req.query;
        if (!currentUserUuid || !recipientUuid) {
            res.status(400).json({ error: "Both current user UUID and recipient UUID are required" });
            return;
        }
        // 1. Resolve both UUIDs to their integer profile IDs
        const profilesQuery = `SELECT id, uuid FROM profiles WHERE uuid = ANY($1::uuid[])`;
        const profileResult = await pool.query(profilesQuery, [[currentUserUuid, recipientUuid]]);
        const profileMap = new Map();
        profileResult.rows.forEach(row => profileMap.set(row.uuid, row.id));
        const currentUserId = profileMap.get(currentUserUuid);
        const recipientId = profileMap.get(recipientUuid);
        if (!currentUserId || !recipientId) {
            res.status(404).json({ error: "One or both user profiles not found" });
            return;
        }
        // 2. Query messages using sender_id and recipient_id integers, and join back to return sender UUIDs for the frontend
        const query = `
      SELECT 
        m.id, 
        m.uuid,
        sender_p.uuid AS "senderUuid", 
        m.content, 
        m.created_at AS "createdAt"
      FROM messages m
      JOIN profiles sender_p ON m.sender_id = sender_p.id
      WHERE (m.sender_id = $1 AND m.recipient_id = $2)
         OR (m.sender_id = $2 AND m.recipient_id = $1)
      ORDER BY m.created_at ASC;
    `;
        const { rows } = await pool.query(query, [currentUserId, recipientId]);
        res.status(200).json({ messages: rows });
    }
    catch (err) {
        console.error("❌ Error fetching conversation:", getErrorMessage(err));
        res.status(500).json({ error: "Failed to fetch conversation history" });
    }
};
//# sourceMappingURL=fetchMessages.js.map