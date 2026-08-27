// src/services/alertsService.ts
import pool from "@Terminal/Supabase/supabaseConfig.js";
export const fetchUserAlerts = async (userUuidOrId) => {
    // 1. If we passed a UUID string, first resolve it to the numeric profile id
    let userId = userUuidOrId;
    if (typeof userUuidOrId === "string" && isNaN(Number(userUuidOrId))) {
        const userRes = await pool.query(`SELECT id FROM profiles WHERE uuid = $1`, [userUuidOrId]);
        if (userRes.rows.length === 0)
            return [];
        userId = userRes.rows[0].id;
    }
    const query = `
    SELECT 
      a.id,
      a.type,
      a.is_read,
      a.created_at,
      a.reference_id,
      p.uuid AS actor_uuid,
      p.full_name AS actor_name,
      p.avatar_url AS actor_avatar_url,
      c.content AS post_snippet
    FROM alerts a
    JOIN profiles p ON a.actor_id = p.id
    LEFT JOIN content c ON a.reference_id = c.id
    WHERE a.recipient_id = $1
    ORDER BY a.created_at DESC
    LIMIT 25;
  `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};
export const markAlertAsRead = async (alertId, userUuidOrId) => {
    let userId = userUuidOrId;
    if (typeof userUuidOrId === "string" && isNaN(Number(userUuidOrId))) {
        const userRes = await pool.query(`SELECT id FROM profiles WHERE uuid = $1`, [userUuidOrId]);
        if (userRes.rows.length === 0)
            return;
        userId = userRes.rows[0].id;
    }
    await pool.query(`UPDATE alerts SET is_read = TRUE WHERE id = $1 AND recipient_id = $2`, [alertId, userId]);
};
//# sourceMappingURL=alertsService.js.map