// src/services/getSingleTaskService.ts
import pool from "@/Terminal/Supabase/supabaseConfig.js";

export const fetchSingleTaskById = async (taskId: string | number, client = pool) => {
  const query = `
    SELECT 
      c.id,
      c.uuid,
      c.content,
      c.img_url,
      c.created_at,
      p.uuid AS author_uuid,
      p.full_name AS author_name,
      p.avatar_url AS author_avatar_url
    FROM content c
    JOIN profiles p ON c.user_uuid = p.uuid
    WHERE c.id = $1 OR c.uuid = $1
    LIMIT 1;
  `;

  const result = await client.query(query, [taskId]);
  return result.rows[0] || null;
};