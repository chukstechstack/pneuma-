import pool from "../../config/supabaseConfig.js";
import redisClient from "../../config/redisCreateClient.js";

export const toggleFollow = async (req, res, next) => {
  const follower_numeric_id = req.user?.id; // You (The person clicking)
  const follower_uuid = req.user?.uuid;     // Your unique tracking string
  const { targetProfileUuid } = req.params;  // The creator you want to follow

  // 🎯 FIXED 1: Safety check updated to use targetProfileUuid to prevent variable crashes
  if (follower_uuid === targetProfileUuid) {
    return res.status(400).json({ error: "You cannot follow your own sanctuary profile" });
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
      dbClient.release(); // Explicitly release right before returning
      return res.status(404).json({ error: "Luminary profile not found" });
    }

    // GRABBING THE FIRST ROW ITEM SAFELY
    const following_numeric_id = profileRes.rows[0].id;

    const checkRes = await dbClient.query(
      `SELECT id, status FROM follows 
   WHERE follower_id = $1 AND following_id = $2`,
      [follower_numeric_id, following_numeric_id]
    );
    let didFollow = false;
    if (checkRes.rows.length > 0) {
      // 1. Grab the current status from the database row string
      const currentStatus = checkRes.rows[0].status;
      didFollow = false;
      // 2. UNFOLLOW / CANCEL: Remove the connection row
      await dbClient.query(
        `DELETE FROM follows 
     WHERE follower_id = $1 AND following_id = $2`,
        [follower_numeric_id, following_numeric_id]
      );

      // 🚨 THE CRITICAL FIX: Only decrease counts if the relation was active!
      // If it was 'pending', we skip this entirely so counts stay perfectly safe.
      if (currentStatus === "active") {
        // Decrease your following count
        await dbClient.query(
          `UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = $1`,
          [follower_numeric_id]
        );

        // Decrease their followers count
        await dbClient.query(
          `UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = $1`,
          [following_numeric_id]
        );
      }
    } else {
      didFollow = true;
      // 4. FOLLOW: Add a new connection row
      await dbClient.query(
        `INSERT INTO follows (follower_id, following_id) 
         VALUES ($1, $2)`,
        [follower_numeric_id, following_numeric_id]
      );
    }

    // Permanently seal database updates FIRST
    await dbClient.query("COMMIT");

    // =================================================================
    // 🧹 FIXED 3: WILDCARD REDIS CACHE INVALIDATION BROOM SYSTEM (FOLLOWS)
    // =================================================================
    try {
      if (follower_uuid) {
        // ── A. Sweep out your home feed pages so the follow checkbox updates ──
        const homeFeedPattern = `tasks_feed:${follower_uuid}:*`;
        const homeKeys = await redisClient.keys(homeFeedPattern);
        if (homeKeys.length > 0) {
          await redisClient.del(homeKeys);
          console.log(` sweep away ${homeKeys.length} home feed chunks for follow change.`);
        }

        // ── B. Sweep out your private feed snapshots just to be completely safe ──
        const journalPattern = `journal_feed:${follower_uuid}:*`;
        const journalKeys = await redisClient.keys(journalPattern);
        if (journalKeys.length > 0) {
          await redisClient.del(journalKeys);
          console.log(` sweep away ${journalKeys.length} private feed chunks for follow change.`);
        }
      }
    } catch (cacheErr) {
      console.error("⚠️ Non-critical follow cache sweep error:", cacheErr.message);
    }

    console.log(`💾 [FOLLOW CHANGE SECURED]: User ${follower_uuid} toggled follow on ${targetProfileUuid}.`);

    return res.json({
      message: "Follow status updated successfully",
      isFollowing: didFollow  // Matches your frontend res.data.isFollowing hook perfectly
    });

  } catch (err) {
    await dbClient.query("ROLLBACK");
    console.error("❌ ERROR IN [toggleFollow Controller]:", err.stack || err.message);
    next(err);
  } finally {
    dbClient.release();
  }
};
