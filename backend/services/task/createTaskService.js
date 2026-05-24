import pool from "../../config/supabaseConfig.js";

// 1. Insert raw text content and image link into content table
export const insertNewTask = async (content, img_url, user_id, client = pool) => {
  const result = await client.query(

    `INSERT INTO content(title, content, img, user_id) 
     VALUES($1, $2, $3, $4) RETURNING *`,
    ['Spiritual Decree', content, img_url, user_id]
  );
  return result.rows[0] || null;
};

// 2. Query data with author profile mappings for real-time frontend integration
export const fetchHydratedTaskById = async (newPostId, client = pool) => {
  const result = await client.query(
    `SELECT c.*,
            c.user_id,
            CONCAT(p.first_name, ' ', p.last_name) AS author_name,
            p.avatar_url,
            c.likes_count,    -- Grabs our real, new integer column!
            c.reposts_count,  -- Grabs our real, new integer column!
            c.shares_count,   -- Grabs our real, new integer column!
            false AS is_liked,     -- Fresh posts always start as unliked
            false AS is_reposted   -- Fresh posts always start as unreposted
     FROM content c
     JOIN profiles p ON c.user_id = p.id
     WHERE c.id = $1`,
    [newPostId]
  );
  return result.rows[0] || null;
};
