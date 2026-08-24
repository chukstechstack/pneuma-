// src/services/alertsService.ts
import pool from "@/Terminal/Supabase/supabaseConfig.js";

export const fetchUserAlerts = async (userUuid: string) => {
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
    JOIN profiles p ON a.actor_uuid = p.uuid
    LEFT JOIN content c ON a.reference_id = c.id
    WHERE a.recipient_uuid = $1
    ORDER BY a.created_at DESC
    LIMIT 25;
  `;
  const result = await pool.query(query, [userUuid]);
  return result.rows;
};

export const markAlertAsRead = async (alertId: number | string, userUuid: string) => {
  await pool.query(
    `UPDATE alerts SET is_read = TRUE WHERE id = $1 AND recipient_uuid = $2`,
    [alertId, userUuid]
  );
};