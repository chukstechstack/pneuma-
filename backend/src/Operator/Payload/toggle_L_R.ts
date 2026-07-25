import redisClient from "@/Terminal/Redis/redisCreateClient";
import { executeToggleInteraction } from "@/Workshop/Payload/toggle_L_R.js";
import type { Request, Response, NextFunction } from "express";
import { getErrorMessage } from "../../Types";

type InteractionType = 'like' | 'repost' | 'share';

interface ToggleInteractionParams {
  contentUuid: string;
}

interface ToggleInteractionRequestBody {
  type: InteractionType;
}

interface ToggleInteractionResponseData {
  message: string;
  action?: string;
  updatedPost?: unknown;
  error?: string;
}

interface AuthenticatedToggleInteractionRequest extends Request<ToggleInteractionParams, unknown, ToggleInteractionRequestBody> {
  user?: {
    id?: number;
    uuid?: string;
  };
}

export const toggleInteraction = async (
  req: AuthenticatedToggleInteractionRequest,
  res: Response,
  next: NextFunction
) => {
  const user_numeric_id = req.user?.id;
  const user_uuid = req.user?.uuid;
  const { contentUuid } = req.params;
  const { type } = req.body;

  if (!user_numeric_id) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!['like', 'repost', 'share'].includes(type)) {
    return res.status(400).json({ error: "Invalid interaction type" });
  }

  try {
    const result = await executeToggleInteraction(user_numeric_id, contentUuid, type);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    if (user_uuid) {
      const homeFeedPattern = `tasks_feed:${user_uuid}:*`;
      const homeKeys = await redisClient.keys(homeFeedPattern);
      if (homeKeys.length > 0) {
        await redisClient.del(homeKeys);
        console.log(`🧹 Redis Swept: Cleaned out ${homeKeys.length} paginated home feed drawers.`);
      }

      if (type === "repost") {
        const journalPattern = `journal_feed:${user_uuid}:*`;
        const journalKeys = await redisClient.keys(journalPattern);
        if (journalKeys.length > 0) {
          await redisClient.del(journalKeys);
          console.log(`🧹 Redis Swept: Cleaned out ${journalKeys.length} private sanctuary journal pages.`);
        }
      }
    }

    console.log(`💾 [SERVICE SYNC COMPLETE]: User (ID: ${user_numeric_id}) performed "${type}". Action: ${result.action}`);

    const responseData: ToggleInteractionResponseData = {
      message: "Interaction updated successfully",
      action: result.action,
      updatedPost: result.updatedPost
    };

    return res.json(responseData);

  } catch (err: unknown) {
    console.error("❌ BACKEND CONTROLLER LAYER caught an interaction crash:", getErrorMessage(err));
    next(err);
  }
};