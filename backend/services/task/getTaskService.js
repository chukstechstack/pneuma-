import pool from "../../config/supabaseConfig.js";

// Fetches the global reverse-chronological feed with aggregate profile and like metrics
export const fetchGlobalTasksFeed = async (user_uuid) => {
  let numericUserId = null;

  // 1. If we have a UUID string, look up the matching numeric ID from the profiles table
  if (user_uuid) {
    const userRes = await pool.query("SELECT id FROM profiles WHERE uuid = $1", [user_uuid]);
    if (userRes.rows.length > 0) {
      numericUserId = userRes.rows[0].id; // Pull the raw number out safely
    }
  }

  // 2. Run the main query using the numeric ID column (user_id)
  const result = await pool.query(
    `SELECT 
      c.*, 
      CONCAT(p.first_name, ' ', p.last_name) AS author_name, 
      p.avatar_url,
      (SELECT COUNT(*) FROM likes WHERE post_id = c.id) AS like_count,
      EXISTS (SELECT 1 FROM likes WHERE post_id = c.id AND user_id = $1) AS is_liked
     FROM content c 
     LEFT JOIN profiles p ON c.user_id = p.id 
     ORDER BY c.created_at DESC`,
    [numericUserId], // Safe numeric fallback (null if guest/new user has no likes yet)
  );

  return result.rows;
};
