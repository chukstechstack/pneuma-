import pool from "../../config/supabaseConfig.js";
import redisClient from "../../config/redisCreateClient.js";

export const toggleFollow = async (req, res, next) => {
  const follower_numeric_id = req.user?.id; // You (The person clicking)
  const follower_uuid = req.user?.uuid;     // Your unique tracking string
  const { targetProfileUuid } = req.params;  // The creator you want to follow

  // Safety check: Prevent a user from trying to follow themselves
  if (follower_uuid === targetProfileUuid) {
    return res.status(400).json({ error: "You cannot follow your own sanctuary" });
  }

  const dbClient = await pool.connect();

  try {
    await dbClient.query("BEGIN");

    // 1. Find the internal numeric ID of the person you want to follow
    const profileRes = await dbClient.query(
      `SELECT id FROM profiles WHERE uuid = $1`,
      [targetProfileUuid]
    );

    if (profileRes.rows.length === 0) {
      await dbClient.query("ROLLBACK");
      dbClient.release();
      return res.status(404).json({ error: "Luminary profile not found" });
    }

    // 🔽 GRABBING THE FIRST ROW ITEM SAFELY
    const following_numeric_id = profileRes.rows[0].id;

    // 2. Check if you already follow this person
    const checkRes = await dbClient.query(
      `SELECT id FROM follows 
       WHERE follower_id = $1 AND following_id = $2`,
      [follower_numeric_id, following_numeric_id]
    );

    const alreadyFollowing = checkRes.rows.length > 0;

    if (alreadyFollowing) {
      // 3. UNFOLLOW: Remove the connection row
      await dbClient.query(
        `DELETE FROM follows 
         WHERE follower_id = $1 AND following_id = $2`,
        [follower_numeric_id, following_numeric_id]
      );

      // Decrease your following count
      await dbClient.query(
        `UPDATE profiles SET following_count = following_count - 1 WHERE id = $1`,
        [follower_numeric_id]
      );

      // Decrease their followers count
      await dbClient.query(
        `UPDATE profiles SET followers_count = followers_count - 1 WHERE id = $1`,
        [following_numeric_id]
      );

    } else {
      // 4. FOLLOW: Add a new connection row
      await dbClient.query(
        `INSERT INTO follows (follower_id, following_id) 
         VALUES ($1, $2)`,
        [follower_numeric_id, following_numeric_id]
      );

      // Increase your following count
      await dbClient.query(
        `UPDATE profiles SET following_count = following_count + 1 WHERE id = $1`,
        [follower_numeric_id]
      );

      // Increase their followers count
      await dbClient.query(
        `UPDATE profiles SET followers_count = followers_count + 1 WHERE id = $1`,
        [following_numeric_id]
      );
    }

    await dbClient.query("COMMIT");

    // 5. CACHE BUSTER: Wipe out your feed cache so it updates instantly
    const cacheKey = `tasks_feed:${follower_uuid || 'guest'}`;
    await redisClient.del(cacheKey);

    console.log(`💾 [FOLLOW CHANGE]: User ${follower_uuid} toggled follow on ${targetProfileUuid}.`);

    return res.json({
      message: "Follow status updated successfully",
      isFollowing: !alreadyFollowing
    });

  } catch (err) {
    if (dbClient) await dbClient.query("ROLLBACK");
    console.error("❌ ERROR IN [toggleFollow Controller]:", err.stack || err.message);
    next(err);
  } finally {
    dbClient.release();
  }
};
