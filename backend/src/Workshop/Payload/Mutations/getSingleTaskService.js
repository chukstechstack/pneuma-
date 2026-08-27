// src/services/getSingleTaskService.ts
import pool from "@/Terminal/Supabase/supabaseConfig.js";
export const fetchSingleTaskById = async (taskId, client = pool) => {
    const query = `
    SELECT 
      c.id,
      c.uuid,
      c.content,
      c.img AS img_url, -- Mapped to match your schema column 'img'
      c.created_at,
      p.uuid AS author_uuid,
      p.full_name AS author_name,
      p.avatar_url AS author_avatar_url
    FROM content c
    JOIN profiles p ON c.user_id = p.id  -- Fixed: Use user_id referencing profiles(id)
  WHERE c.uuid::text = $1 
   OR (c.id::text = $1 AND $1 ~ '^[0-9]+$')
    LIMIT 1;
  `;
    const result = await client.query(query, [taskId]);
    return result.rows[0] || null;
};
//# sourceMappingURL=getSingleTaskService.js.map