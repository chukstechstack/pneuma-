import pool from "../../config/supabaseConfig.js";

// 1. Insert raw text content and image link into content table
// ADDED: client parameter (defaults to pool if not provided)
export const insertNewTask = async (content, img_url, user_id, client = pool) => {
  // CHANGED: Uses client instead of pool
  const result = await client.query(
    `INSERT INTO content(content, img, user_id) VALUES($1, $2, $3) RETURNING *`,
    [content, img_url, user_id]
  );
  return result.rows[0] || null;
};

// 2. Query data with author profile mappings for real-time frontend integration
// ADDED: client parameter (defaults to pool if not provided)
export const fetchHydratedTaskById = async (newPostId, client = pool) => {
  // CHANGED: Uses client instead of pool
  const result = await client.query(
    `SELECT c.*,
            c.user_id,
            CONCAT(p.first_name, ' ', p.last_name) AS author_name,
            p.avatar_url,
            0 AS like_count,
            false AS is_liked
     FROM content c
     JOIN profiles p ON c.user_id = p.id
     WHERE c.id = $1`,
    [newPostId]
  );
  return result.rows[0] || null;
};
