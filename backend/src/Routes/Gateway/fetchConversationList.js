import pool from "@/Terminal/Supabase/supabaseConfig.js";
import { getErrorMessage } from "../../Toolkit/GetErrorMessage/getErrorMessage";
export const fetchConversationsList = async (req, res) => {
    try {
        const currentUserUuid = req.user?.uuid;
        const currentUserIdInput = req.user?.id;
        if (!currentUserUuid && !currentUserIdInput) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // 1. Resolve to the integer profile ID if we only have the UUID
        let currentUserId = currentUserIdInput;
        if (!currentUserId && currentUserUuid) {
            const profileRes = await pool.query("SELECT id FROM profiles WHERE uuid = $1", [currentUserUuid]);
            if (profileRes.rows.length > 0) {
                currentUserId = profileRes.rows[0].id;
            }
        }
        if (!currentUserId) {
            res.status(401).json({ error: "User profile not found" });
            return;
        }
        // 2. Query using integer IDs (sender_id & recipient_id) and join profiles to get partner info
        const query = `
      WITH RankedMessages AS (
        SELECT 
          m.id,
          m.content,
          m.created_at,
          m.sender_id,
          m.recipient_id,
          CASE 
            WHEN m.sender_id = $1 THEN m.recipient_id 
            ELSE m.sender_id 
          END AS partner_internal_id,
          ROW_NUMBER() OVER (
            PARTITION BY CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END 
            ORDER BY m.created_at DESC
          ) as rn
        FROM messages m
        WHERE m.sender_id = $1 OR m.recipient_id = $1
      )
      SELECT 
        rm.id,
        rm.content,
        rm.created_at AS "createdAt",
        p.uuid AS "partnerUuid",
        p.full_name AS "partnerName",
        p.avatar_url AS "partnerAvatarUrl"
      FROM RankedMessages rm
      JOIN profiles p ON p.id = rm.partner_internal_id
      WHERE rm.rn = 1
      ORDER BY rm.created_at DESC;
    `;
        const { rows } = await pool.query(query, [currentUserId]);
        res.status(200).json({ conversations: rows });
    }
    catch (err) {
        console.error("❌ Error fetching conversations list:", getErrorMessage(err));
        res.status(500).json({ error: "Failed to fetch conversations list" });
    }
};
//# sourceMappingURL=fetchConversationList.js.map