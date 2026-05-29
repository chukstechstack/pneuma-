import pool from "../../config/supabaseConfig.js";

// 1. Insert raw text content and image link into content table
export const insertNewTask = async (content, img_url, user_id, client = pool) => {
  const result = await client.query(
    `INSERT INTO content(title, content, img, user_id) 
     VALUES($1, $2, $3, $4) RETURNING *`,
    ['Insight', content, img_url, user_id] // 👈 Updated subtitle layout text to match homepage
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
            p.uuid AS author_profile_uuid, -- 👈 1. Added profile UUID to match safety checks
            c.likes_count,    
            c.reposts_count,  
            c.shares_count,   
            false AS is_liked,     
            false AS is_reposted,   
            false AS is_following   -- 👈 2. Fresh posts you create are always unfollowed
     FROM content c
     JOIN profiles p ON c.user_id = p.id
     WHERE c.id = $1`,
    [newPostId]
  );
  return result.rows[0] || null;
};
