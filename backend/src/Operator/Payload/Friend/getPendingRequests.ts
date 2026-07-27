import type { Request, Response, NextFunction } from "express";
import { fetchPendingRequestsQuery, PendingRequestRow } from "@Workshop/Payload/Friend/pendingRequestsServices.js";
import { getErrorMessage } from "@/Toolkit/GetErrorMessage/getErrorMessage.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string | number;
  };
}

interface PendingRequestsResponseData {
  requests: PendingRequestRow[];
}

export const getPendingRequests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorProfileId = req.user?.id;

  if (!authorProfileId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const requests = await fetchPendingRequestsQuery(authorProfileId);

    const responseData: PendingRequestsResponseData = { requests };
    return res.status(200).json(responseData);
    
  } catch (err: unknown) {
    console.error("❌ BACKEND CONTROLLER LAYER caught a pending requests crash:", getErrorMessage(err));
    next(err);
  }
};