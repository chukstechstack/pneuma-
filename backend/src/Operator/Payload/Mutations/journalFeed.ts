import type { Request, Response, NextFunction } from "express";
import redisClient from "@/Terminal/Redis/redisCreateClient.js";
import { fetchUserJournalFeed } from "@/Workshop/Payload/Mutations/journalFeed.js";

interface JournalFeedRequestParams {
  targetUserUuid: string;
}

interface JournalFeedRequestQuery {
  freeze_time?: string;
  fresh_load?: string;
}

interface AuthenticatedRequest extends Request<JournalFeedRequestParams, unknown, unknown, JournalFeedRequestQuery> {
  user?: {
    uuid?: string;
    id?: string | number;
  };
}

interface JournalFeedFetchResult {
  journalFeedTasks: unknown[];
  next_post_timestamp?: string | number | null;
}

interface JournalFeedResponseData {
  tasks: unknown[];
  next_post_timestamp: string | number | null;
  currentUserId: string | number | undefined;
  currentUserUuid: string | undefined;
}

export const journalFeed = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const logged_in_user_uuid: string | undefined = req.user?.uuid;
  const { targetUserUuid } = req.params;
  const fresh_load_pointer = req.query.fresh_load || 'Yes_Is_FreshLoad';
console.log("targetUser"+ targetUserUuid)
  // Use a unique cache namespace for the journal feed to avoid home feed collisions
  const redisFreshLoad = `journal_feed_cache:${targetUserUuid || 'guest'}:${fresh_load_pointer}`;

  try {
    const redisData = await redisClient.get(redisFreshLoad);
    if (redisData) {
      console.log(`⚡ Redis Hit: Serving journal feed [Target: ${targetUserUuid}] [Pointer: ${fresh_load_pointer}]`);
      return res.json(JSON.parse(redisData));
    }

    console.log(`🐢 Redis Miss: Fetching journal from Postgres [Target: ${targetUserUuid}] [Pointer: ${fresh_load_pointer}]`);

    const { journalFeedTasks, next_post_timestamp } = await fetchUserJournalFeed(
      targetUserUuid,
      logged_in_user_uuid,
      fresh_load_pointer
    ) as JournalFeedFetchResult;

    const responseData: JournalFeedResponseData = {
      tasks: journalFeedTasks,
      next_post_timestamp: next_post_timestamp || null,
      currentUserId: req.user?.id,
      currentUserUuid: req.user?.uuid, 
    };

    await redisClient.set(redisFreshLoad, JSON.stringify(responseData), { EX: 300 });

    return res.json(responseData);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ ERROR IN [journalFeed Controller]:", errorMessage);
    next(err);
  }
};