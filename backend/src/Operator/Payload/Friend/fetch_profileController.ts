import type { Request, Response, NextFunction } from "express";
import { fetchSmartProfileFeedData, type SmartProfileFeedResult } from  "@Workshop/Payload/Friend/fetchProfileFeedServices";

interface AuthenticatedRequest<P = Record<string, any>> extends Request<P> {
  user?: {
    id: number | string;
  };
}

interface SmartProfileFeedParams {
  targetProfileUuid?: string;
}

export const getSmartProfileFeed = async (
  req: AuthenticatedRequest<SmartProfileFeedParams>,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserProfileId = req.user?.id;
  const { targetProfileUuid } = req.params;

  if (!loggedInUserProfileId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const responseData: SmartProfileFeedResult = await fetchSmartProfileFeedData(
      loggedInUserProfileId,
      targetProfileUuid
    );   

    return res.json(responseData);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    if (errorMessage === "PROFILE_NOT_FOUND") {
      return res.status(404).json({ error: "Sanctuary profile not found" });
    }

    console.error("❌ Error inside getSmartProfileFeed:", errorMessage);
    next(err);
  }
};