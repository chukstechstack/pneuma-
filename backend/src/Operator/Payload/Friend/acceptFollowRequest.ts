import type { Request, Response, NextFunction } from "express";
import type { Server as SocketServer } from "socket.io";
import { executeAcceptFollowService } from "@Workshop/Payload/Friend/acceptFollowRequestServices.js";

interface AcceptFollowRequestParams {}

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

  const acceptorNumericId = Number(req.user.id);
  const acceptorUuid = req.user.uuid;
  const { targetUuid, action } = req.body;

  if (!targetUuid || !action) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    await executeAcceptFollowService(
      acceptorNumericId,
      acceptorUuid,
      targetUuid,
      action
    );

    // =================================================================
    // 🧹 Socket Notification (Fully Typed)
    // =================================================================
    const io: SocketServer = req.app.get("socketio");

    const requesterRoom = `current_Logged_In_User_Uuid:${targetUuid}`;
    const acceptorRoom = `current_Logged_In_User_Uuid:${acceptorUuid}`;

    if (action === 'accept') {
      io.to(requesterRoom).emit("connection_status_updated_for_accepted_user", {
        partner_Uuid: acceptorUuid,
        newStatus: 'active'
      });

      io.to(acceptorRoom).emit("connection_updated_for_requested_user", {
        partner_Uuid: targetUuid,
        newStatus: 'active'
      });
    } else {
      io.to(requesterRoom).emit("unConnect_Status_Changes", {
        partner_Uuid: acceptorUuid,
        newStatus: null
      });
    }

    const responseData: AcceptFollowResponseData = { 
      status: action === 'accept' ? 'active' : null 
    };

    return res.json(responseData);

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    if (errorMessage === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ error: "Requester profile not found" });
    }

    const fullStackError = err instanceof Error ? (err.stack || err.message) : String(err);
    console.error("❌ ERROR IN [acceptFollowRequest Controller]:", fullStackError);
    
    next(err);
  }
};