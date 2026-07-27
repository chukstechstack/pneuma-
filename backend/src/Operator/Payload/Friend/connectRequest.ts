import type { Request, Response, NextFunction } from "express";
import type { Server as SocketServer } from "socket.io";
import { executeConnectRequestService, type ProfileRow, type FollowRow } from  "@Workshop/Payload/Friend/connectionRequestServices.js"

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

export const connectRequest = async (
  req: AuthenticatedRequest<ConnectRequestParams, unknown, ConnectRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const followerNumericId = Number(req.user?.id);
  const followerUuid = req.user?.uuid;
  const { targetProfileUuid } = req.params;

  if (!req.user?.id || !followerUuid || !targetProfileUuid || Number.isNaN(followerNumericId)) {
    return res.status(400).json({ error: "Missing required identifiers" });
  }

  try {
    const { didFollow } = await executeConnectRequestService(
      followerNumericId,
      followerUuid,
      targetProfileUuid
    );

    // =================================================================
    // 🧹 Socket Notification (Fully Typed)
    // =================================================================
    const io: SocketServer = req.app.get("socketio");
    
    io.to(`current_Logged_In_User_Uuid:${targetProfileUuid}`).emit(
      didFollow ? "incoming_connect_request" : "unConnect_Status_Changes",
      didFollow ? { requested_User_Uuid: followerUuid } : { partner_Uuid: followerUuid }
    );

    console.log(`Sending to target Profile:${targetProfileUuid}`);

    io.to(`current_Logged_In_User_Uuid:${followerUuid}`).emit("connection_updated_for_requested_user", {
      partner_Uuid: targetProfileUuid,
      newStatus: didFollow ? 'pending' : null
    });
    
    console.log(`Sending to Follower_Profile:${followerUuid}`);

    const responseData: ConnectResponseData = { isFollowing: didFollow };
    return res.json(responseData);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    
    if (message === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ error: "Profile not found" });
    }

    console.error("❌ CRASHED:", message);
    return res.status(500).json({ error: message });
  }
};