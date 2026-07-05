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
      `SELECT id, status FROM follows 
   WHERE follower_id = $1 AND following_id = $2`,
      [follower_numeric_id, following_numeric_id]
    );
    let didFollow = false;
    if (checkRes.rows.length > 0) {

      const currentStatus = checkRes.rows[0].status;
      didFollow = false;

      await dbClient.query(
        `DELETE FROM follows 
     WHERE follower_id = $1 AND following_id = $2`,
        [follower_numeric_id, following_numeric_id]
      );
      if (currentStatus === "active") {
        await dbClient.query(
          `UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = $1`,
          [follower_numeric_id]
        );
        await dbClient.query(
          `UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = $1`,
          [following_numeric_id]
        );
      }
    } else {
      didFollow = true;

      await dbClient.query(
        `INSERT INTO follows (follower_id, following_id) 
         VALUES ($1, $2)`,
        [follower_numeric_id, following_numeric_id]
      );
    }


    await dbClient.query("COMMIT");
    if (didFollow) {
      const io = req.app.get("socketio");
      const authorRoom = `current_Logged_In_User_Uuid:${targetProfileUuid}`;
      const strangerPayload = {
        followerUuid: follower_uuid,
        firstName: req.user?.first_name || "Enlightened",
        lastName: req.user?.last_name || "Luminary",
        avatarUrl: req.user?.avatar_url || null
      };
      io.to(authorRoom).emit("incoming_connect_request", strangerPayload);
      console.log(`📡 Real-time follow request sent straight into custom room: ${authorRoom}`);
    } else {
      const io = req.app.get("socketio");
      const authorRoom = `current_Logged_In_User_Uuid:${targetProfileUuid}`;
      io.to(authorRoom).emit("unConnect_Status_Changes", {
        followerUuid: follower_uuid,
        newStatus: null // Telling the frontend to reset status to null
      });
    }

    try {
      if (follower_uuid) {
        const homeFeedPattern = `tasks_feed:${follower_uuid}:*`;
        const homeKeys = await redisClient.keys(homeFeedPattern);
        if (homeKeys.length > 0) {
          await redisClient.del(homeKeys);
          console.log(` sweep away ${homeKeys.length} home feed chunks for follow change.`);
        }

        const journalPattern = `journal_feed:${follower_uuid}:*`;
        const journalKeys = await redisClient.keys(journalPattern);
        if (journalKeys.length > 0) {
          await redisClient.del(journalKeys);
          console.log(` sweep away ${journalKeys.length} private feed chunks for follow change.`);
        }
      }


      if (targetProfileUuid) {
        const authorProfilePattern = `profile_feed:${targetProfileUuid}:*`;
        const authorProfileKeys = await redisClient.keys(authorProfilePattern);
        if (authorProfileKeys.length > 0) {
          await redisClient.del(authorProfileKeys);
          console.log(`🧹 Swept away ${authorProfileKeys.length} profile cache chunks for target author.`);
        }
      }

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
    console.error("❌ ERROR IN [toggleFollow Controller]:", err.stack || err.message);
    next(err);
  } finally {
    dbClient.release();
  }
};
