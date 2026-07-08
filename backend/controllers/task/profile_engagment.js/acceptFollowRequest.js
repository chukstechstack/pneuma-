import pool from "../../../config/supabaseConfig.js";
import redisClient from "../../../config/redisCreateClient.js";

export const acceptFollowRequest = async (req, res, next) => {
    // 1. Validation: Ensure user is logged in
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const acceptor_numeric_id = req.user.id;
    const acceptor_uuid = req.user.uuid; // You needed this for the room name
    const { requested_User_Uuid, action } = req.body;

    if (!requested_User_Uuid || !action) {
        return res.status(400).json({ error: "Invalid request payload" });
    }

    const dbClient = await pool.connect();

    try {
        await dbClient.query("BEGIN");

        // 2. Fetch the requester's numeric ID using their UUID
        const profileRes = await dbClient.query(
            `SELECT id FROM profiles WHERE uuid = $1`,
            [requested_User_Uuid]
        );

        if (profileRes.rows.length === 0) {
            await dbClient.query("ROLLBACK");
            dbClient.release();
            return res.status(404).json({ error: "Requester profile not found" });
        }

        const requester_numeric_id = profileRes.rows[0].id;

        // 3. Perform the Action
        if (action === 'accept') {
            await dbClient.query(
                `UPDATE follows SET status = 'active' 
                 WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'`,
                [requester_numeric_id, acceptor_numeric_id]

            );
            console.error(`requested Accepted for ${requester_numeric_id, acceptor_numeric_id}`)
        } else if (action === 'decline') {
            await dbClient.query(
                `DELETE FROM follows 
                 WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'`,
                [requester_numeric_id, acceptor_numeric_id]
            );
            console.error(`requested Declined for ${requester_numeric_id, acceptor_numeric_id}`)
        }

        await dbClient.query("COMMIT");

        // 4. Socket Notifications
        const io = req.app.get("socketio");
        const requesterRoom = `current_Logged_In_User_Uuid:${requested_User_Uuid}`;
        const acceptorRoom = `current_Logged_In_User_Uuid:${acceptor_uuid}`;

        // ... [Inside the acceptFollowRequest controller]

        if (action === 'accept') {
            if (action === 'accept') {

                io.to(requesterRoom).emit("connection_status_updated_for_accepted_user", {
                    partner_Uuid: acceptor_uuid,
                    newStatus: 'active'
                });

                io.to(acceptorRoom).emit("connection_updated_for_requested_user", {
                    partner_Uuid: requested_User_Uuid,
                    newStatus: 'active'
                });
            }
        } else {

            io.to(requesterRoom).emit("unConnect_Status_Changes", {
                requested_User_Uuid: acceptor_uuid,
                newStatus: null
            });
        }

        return res.json({ status: action === 'accept' ? 'active' : null });

    } catch (err) {
        await dbClient.query("ROLLBACK");
        console.error("❌ ERROR IN [acceptFollowRequest Controller]:", err.stack || err.message);
        next(err);
    } finally {
        dbClient.release();
    }
};