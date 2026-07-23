import pool from "../../../config/supabaseConfig.js";
import redisClient from "../../../config/redisCreateClient.js";

export const acceptFollowRequest = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const acceptor_numeric_id = req.user.id;
    const acceptor_uuid = req.user.uuid;
    const { targetUuid, action } = req.body;

    if (!targetUuid || !action) {
        return res.status(400).json({ error: "Invalid request payload" });
    }

    const dbClient = await pool.connect();

    try {
        await dbClient.query("BEGIN");

   
        const profileRes = await dbClient.query(
            `SELECT id FROM profiles WHERE uuid = $1`,
            [targetUuid]
        );

        if (profileRes.rows.length === 0) {
            await dbClient.query("ROLLBACK");
            dbClient.release();
            return res.status(404).json({ error: "Requester profile not found" });
        }

        const requester_numeric_id = profileRes.rows[0].id;

        if (action === 'accept') {
            await dbClient.query(
                `UPDATE follows SET status = 'active' 
                 WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'`,
                [requester_numeric_id, acceptor_numeric_id]
            );
        } else if (action === 'decline') {
            await dbClient.query(
                `DELETE FROM follows 
                 WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'`,
                [requester_numeric_id, acceptor_numeric_id]
            );
        }

        await dbClient.query("COMMIT");

        // --- Socket Notifications ---
        const io = req.app.get("socketio");

        // Rooms based on the two users involved
        const requesterRoom = `current_Logged_In_User_Uuid:${targetUuid}`;
        const acceptorRoom = `current_Logged_In_User_Uuid:${acceptor_uuid}`;

        if (action === 'accept') {
            // Notify the requester that their request was accepted
            io.to(requesterRoom).emit("connection_status_updated_for_accepted_user", {
                partner_Uuid: acceptor_uuid,
                newStatus: 'active'
            });

            // Notify the acceptor that the requester is now active
            io.to(acceptorRoom).emit("connection_updated_for_requested_user", {
                partner_Uuid: targetUuid,
                newStatus: 'active'
            });
        } else {
            // Notify the requester that the request was declined/deleted
            io.to(requesterRoom).emit("unConnect_Status_Changes", {
                partner_Uuid: acceptor_uuid,
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