import pool from "../../../config/supabaseConfig.js";
export const connectRequest = async (req, res, next) => {
  const follower_numeric_id = req.user?.id;
  const follower_uuid = req.user?.uuid;
  const { targetProfileUuid } = req.params;

  if (!follower_numeric_id || !targetProfileUuid) {
    return res.status(400).json({ error: "Missing required identifiers" });
  }

  const dbClient = await pool.connect();
  try {
    await dbClient.query("BEGIN");


    const profileRes = await dbClient.query("SELECT id FROM profiles WHERE uuid = $1", [targetProfileUuid]);
    if (profileRes.rows.length === 0) throw new Error("Profile not found");
    const following_numeric_id = profileRes.rows[0].id;


    const checkRes = await dbClient.query(
      "SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2",
      [follower_numeric_id, following_numeric_id]
    );

    let didFollow;
    if (checkRes.rows.length > 0) {

      await dbClient.query("DELETE FROM follows WHERE follower_id = $1 AND following_id = $2", [follower_numeric_id, following_numeric_id]);
      didFollow = false;
    } else {

      await dbClient.query("INSERT INTO follows (follower_id, following_id, status) VALUES ($1, $2, 'pending')", [follower_numeric_id, following_numeric_id]);
      didFollow = true;
    }

    await dbClient.query("COMMIT");


    const io = req.app.get("socketio");



    // 2. Your existing code
    io.to(`current_Logged_In_User_Uuid:${targetProfileUuid}`).emit(
      didFollow ? "incoming_connect_request" : "unConnect_Status_Changes",
      didFollow ? { requested_User_Uuid: follower_uuid } : { partner_Uuid: follower_uuid }
    );


    console.log(`Sending to target Profile:${targetProfileUuid}`)

    io.to(`current_Logged_In_User_Uuid:${follower_uuid}`).emit("connection_updated_for_requested_user", {
      partner_Uuid: targetProfileUuid,
      newStatus: didFollow ? 'pending' : null
    });
    console.log(`Sending to Follower_Profile:${follower_uuid}`)
    return res.json({ isFollowing: didFollow });

  } catch (err) {
    await dbClient.query("ROLLBACK");
    console.error("❌ CRASHED:", err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    dbClient.release();
  }
};