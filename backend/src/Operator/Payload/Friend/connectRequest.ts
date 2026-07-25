import pool from "@/Terminal/Supabase/supabaseConfig";
import type { Request, Response, NextFunction } from "express";
import type { Server as SocketServer } from "socket.io";
import type { PoolClient } from "pg";

interface ConnectRequestParams {
  targetProfileUuid: string;
}

interface ConnectRequestBody {
  [key: string]: unknown;
}

interface AuthenticatedRequest<P = Record<string, any>, ResBody = unknown, ReqBody = unknown> extends Request<P, ResBody, ReqBody> {
  user?: {
    id?: string | number;
    uuid?: string;
  };
}

interface ConnectResponseData {
  isFollowing: boolean;
}

interface ProfileRow {
  id: number | string;
}

interface FollowRow {
  id: number | string;
}

export const connectRequest = async (
  req: AuthenticatedRequest<ConnectRequestParams, unknown, ConnectRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const follower_numeric_id = Number(req.user?.id);
  const follower_uuid = req.user?.uuid;
  const { targetProfileUuid } = req.params;

  if (!req.user?.id || !follower_uuid || !targetProfileUuid || Number.isNaN(follower_numeric_id)) {
    return res.status(400).json({ error: "Missing required identifiers" });
  }

  const dbClient: PoolClient = await pool.connect();
  
  try {
    await dbClient.query("BEGIN");

    const profileRes = await dbClient.query<ProfileRow>(
      "SELECT id FROM profiles WHERE uuid = $1", 
      [targetProfileUuid]
    );
    
    if (profileRes.rows.length === 0) {
      await dbClient.query("ROLLBACK");
      dbClient.release();
      return res.status(404).json({ error: "Profile not found" });
    }
    
    const following_numeric_id = profileRes.rows[0].id;

    const checkRes = await dbClient.query<FollowRow>(
      "SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2",
      [follower_numeric_id, following_numeric_id]
    );

    let didFollow: boolean;
    if (checkRes.rows.length > 0) {
      await dbClient.query(
        "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2", 
        [follower_numeric_id, following_numeric_id]
      );
      didFollow = false;
    } else {
      await dbClient.query(
        "INSERT INTO follows (follower_id, following_id, status) VALUES ($1, $2, 'pending')", 
        [follower_numeric_id, following_numeric_id]
      );
      didFollow = true;
    }

    await dbClient.query("COMMIT");

    // =================================================================
    // 🧹 Socket Notification (Fully Typed)
    // =================================================================
    const io: SocketServer = req.app.get("socketio");
    
    io.to(`current_Logged_In_User_Uuid:${targetProfileUuid}`).emit(
      didFollow ? "incoming_connect_request" : "unConnect_Status_Changes",
      didFollow ? { requested_User_Uuid: follower_uuid } : { partner_Uuid: follower_uuid }
    );

    console.log(`Sending to target Profile:${targetProfileUuid}`);

    io.to(`current_Logged_In_User_Uuid:${follower_uuid}`).emit("connection_updated_for_requested_user", {
      partner_Uuid: targetProfileUuid,
      newStatus: didFollow ? 'pending' : null
    });
    
    console.log(`Sending to Follower_Profile:${follower_uuid}`);

    const responseData: ConnectResponseData = { isFollowing: didFollow };
    return res.json(responseData);

  } catch (err: unknown) {
    await dbClient.query("ROLLBACK");
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ CRASHED:", message);
    return res.status(500).json({ error: message });
  } finally {
    dbClient.release();
  }
};