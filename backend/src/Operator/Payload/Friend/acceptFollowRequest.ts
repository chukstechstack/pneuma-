import pool from "@/Terminal/Supabase/supabaseConfig";
import type { Request, Response, NextFunction } from "express";
import type { Server as SocketServer } from "socket.io";

interface AcceptFollowRequestParams {
  // Add params if any are in the route path, otherwise leave empty or unknown
}

interface AcceptFollowRequestBody {
  targetUuid?: string;
  action?: 'accept' | 'decline';
}

interface AuthenticatedRequest<P, ResBody, ReqBody> extends Request<P, ResBody, ReqBody> {
  user?: {
    id: string;
    uuid: string;
    [key: string]: any;
  };
}

interface AcceptFollowResponseData {
  status?: 'active' | null;
  error?: string;
}

export const acceptFollowRequest = async (
  req: AuthenticatedRequest<AcceptFollowRequestParams, unknown, AcceptFollowRequestBody>,
  res: Response<AcceptFollowResponseData>,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const acceptor_numeric_id = Number(req.user.id);
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

    // =================================================================
    // 🧹 Socket Notification (Fully Typed)
    // =================================================================
    const io: SocketServer = req.app.get("socketio");

    const requesterRoom = `current_Logged_In_User_Uuid:${targetUuid}`;
    const acceptorRoom = `current_Logged_In_User_Uuid:${acceptor_uuid}`;

    if (action === 'accept') {
      io.to(requesterRoom).emit("connection_status_updated_for_accepted_user", {
        partner_Uuid: acceptor_uuid,
        newStatus: 'active'
      });

      io.to(acceptorRoom).emit("connection_updated_for_requested_user", {
        partner_Uuid: targetUuid,
        newStatus: 'active'
      });
    } else {
      io.to(requesterRoom).emit("unConnect_Status_Changes", {
        partner_Uuid: acceptor_uuid,
        newStatus: null
      });
    }

    const responseData: AcceptFollowResponseData = { 
      status: action === 'accept' ? 'active' : null 
    };

    return res.json(responseData);

  } catch (err: unknown) {
    await dbClient.query("ROLLBACK");
    
    const errorMessage = err instanceof Error ? (err.stack || err.message) : String(err);
    console.error("❌ ERROR IN [acceptFollowRequest Controller]:", errorMessage);
    
    next(err);
  } finally {
    dbClient.release();
  }
};