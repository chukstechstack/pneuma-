import pool from "../../config/supabaseConfig.js";

export const fetchGlobalTasksFeed = async (user_uuid) => {
  let numericUserId = null;

  // 1. Look up the matching numeric ID for the logged-in user
  if (user_uuid) {
    const userRes = await pool.query("SELECT id FROM profiles WHERE uuid = $1", [user_uuid]);
    if (userRes.rows.length > 0) {
      numericUserId = userRes.rows[0].id;
    }
  }

  // 2. Run the new query using our super-fast counters!
  const result = await pool.query(
    `SELECT 
      c.id,
      c.uuid,
      c.title,
      c.content,
      c.img,
      c.created_at,
      c.likes_count,    -- Grabs the pre-calculated number instantly!
      c.reposts_count,  -- Grabs the pre-calculated number instantly!
      c.shares_count,   -- Grabs the pre-calculated number instantly!
      CONCAT(p.first_name, ' ', p.last_name) AS author_name, 
      p.avatar_url,
      c.user_id,
      -- Checks our interactions table to see if THIS user liked it
      EXISTS (
        SELECT 1 FROM interactions 
        WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'like'
      ) AS is_liked,
      -- Checks our interactions table to see if THIS user reposted it
      EXISTS (
        SELECT 1 FROM interactions 
        WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'repost'
      ) AS is_reposted
     FROM content c 
     LEFT JOIN profiles p ON c.user_id = p.id 
     ORDER BY c.created_at DESC`,
    [numericUserId]
  );

  return result.rows;
};
