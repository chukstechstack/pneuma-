import pool from "../../../config/supabaseConfig.js";
import redisClient from "../../../config/redisCreateClient.js";

export const connectRequest = async (req, res, next) => {
  const follower_numeric_id = req.user?.id;
  const follower_uuid = req.user?.uuid;
  const { targetProfileUuid } = req.params;

  if (follower_uuid === targetProfileUuid) {
    return res.status(400).json({ error: "You cannot follow your own sanctuary profile" });
  }

  const dbClient = await pool.connect();

  try {
    await dbClient.query("BEGIN");
    const requesterRes = await dbClient.query(
      `SELECT first_name, last_name, avatar_url FROM profiles WHERE uuid = $1`,
      [follower_uuid]
    );
    const requesterData = requesterRes.rows[0];

    const profileRes = await dbClient.query(
      `SELECT id FROM profiles WHERE uuid = $1`,
      [targetProfileUuid]
    );

    if (profileRes.rows.length === 0) {
      await dbClient.query("ROLLBACK");
      dbClient.release();
      return res.status(404).json({ error: "Luminary profile not found" });
    }

    const following_numeric_id = profileRes.rows[0].id;

    const checkRes = await dbClient.query(
      `SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [follower_numeric_id, following_numeric_id]
    );

    let didFollow = false;
    if (checkRes.rows.length > 0) {

      didFollow = false;
      await dbClient.query(
        `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
        [follower_numeric_id, following_numeric_id]
      );
      console.error(`requested ubConnected for ${follower_numeric_id, following_numeric_id}`)
    } else {

      didFollow = true;
      await dbClient.query(
        `INSERT INTO follows (follower_id, following_id, status) VALUES ($1, $2, 'pending')`,
        [follower_numeric_id, following_numeric_id]
      );
      console.error(`requested Connected for ${follower_numeric_id, following_numeric_id}`)
    }


    await dbClient.query("COMMIT");

    const io = req.app.get("socketio");
    const authorRoom = `current_Logged_In_User_Uuid:${targetProfileUuid}`;

    if (didFollow) {
      const strangerPayload = {
        requested_User_Uuid: follower_uuid, // Changed from followerUuid
        firstName: requesterData?.first_name || "Enlightened",
        lastName: requesterData?.last_name || "Luminary",
        avatarUrl: requesterData?.avatar_url || null
      };
      io.to(authorRoom).emit("incoming_connect_request", strangerPayload);
      console.log(`📡 Real-time follow request sent to: ${authorRoom}`);
    } else {
      io.to(authorRoom).emit("unConnect_Status_Changes", {
        followerUuid: follower_uuid,
        newStatus: null
      });
    }

    try {
      if (follower_uuid) {
        const homeKeys = await redisClient.keys(`tasks_feed:${follower_uuid}:*`);
        if (homeKeys.length > 0) await redisClient.del(homeKeys);

        const journalKeys = await redisClient.keys(`journal_feed:${follower_uuid}:*`);
        if (journalKeys.length > 0) await redisClient.del(journalKeys);
      }

      const authorProfileKeys = await redisClient.keys(`profile_feed:${targetProfileUuid}:*`);
      if (authorProfileKeys.length > 0) await redisClient.del(authorProfileKeys);
    } catch (cacheErr) {
      console.error("⚠️ Non-critical follow cache sweep error:", cacheErr.message);
    }

    console.log(`💾 [FOLLOW CHANGE SECURED]: User ${follower_uuid} toggled follow on ${targetProfileUuid}.`);

    return res.json({
      message: "Follow status updated successfully",
      isFollowing: didFollow
    });

  } catch (err) {
    await dbClient.query("ROLLBACK");
    console.error("❌ ERROR IN [connectRequest Controller]:", err.stack || err.message);
    next(err);
  } finally {
    dbClient.release();
  }
};