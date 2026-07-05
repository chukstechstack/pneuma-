
import pool from "../../../config/supabaseConfig.js";
export const getPendingRequests = async (req, res) => {

  const authorProfileId = req.user.id;

  try {
    const query = `
      SELECT 
        p.uuid AS "requested_User_Uuuid", 
        p.first_name AS "firstName", 
        p.last_name AS "lastName", 
        p.avatar_url AS "avatarUrl"
      FROM follows f
      JOIN profiles p ON f.follower_id = p.id
      WHERE f.following_id = $1 
      AND f.status = 'pending'
    `;

    const { rows } = await pool.query(query, [authorProfileId]);

    res.status(200).json({ requests: rows });
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


