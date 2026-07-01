import pool from "../../../config/supabaseConfig.js";
export const fetchEngagementDetails = async (req, res) => {
  try {
    const { targetProfileUuid } = req.params; // Changed from 'uuid' to match your endpoint
    let targetId;
    // 1. Get the target user's internal ID
    if (targetProfileUuid === 'me') {
      targetId = req.user.id; // Get the authenticated user's internal ID
    } else {
      const targetUser = await pool.query("SELECT id FROM profiles WHERE uuid = $1", [targetProfileUuid]);
      if (targetUser.rows.length === 0) return res.status(404).json({ error: "User not found" });
      targetId = targetUser.rows[0].id;
    }



    // 2. Fetch the Unified Connection List
    // This query gets everyone connected to the targetId
    const connections = await pool.query(`
      SELECT DISTINCT p.uuid, p.username, p.first_name, p.last_name, p.avatar_url
      FROM profiles p
      JOIN follows f ON (p.id = f.follower_id OR p.id = f.following_id)
      WHERE (f.follower_id = $1 OR f.following_id = $1)
      AND f.status = 'active'
      AND p.id != $1
      LIMIT 15`, [targetId]);

    res.json({
      list: connections.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

