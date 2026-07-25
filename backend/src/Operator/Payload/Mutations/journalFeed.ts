import type { Request, Response, NextFunction } from "express";
import redisClient from "@/Terminal/Redis/redisCreateClient";
import { fetchUserJournalFeed } from "@/Workshop/Payload/Mutations/journalFeed";

interface JournalFeedRequestParams {
  journalUuid: string;
}

interface JournalFeedRequestQuery {
  freeze_time?: string;
  fresh_load?: string;
}

interface JournalFeedFetchResult {
  journalFeedTasks: unknown[];
  next_post_timestamp?: string | number | null;
}

interface JournalFeedResponseData {
  tasks: unknown[];
  next_post_timestamp: string | number | null;
  currentUserId: string | number | undefined;
}

export const journalFeed = async (
  req: Request<JournalFeedRequestParams, unknown, unknown, JournalFeedRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const logged_in_user_uuid: string | undefined = req.user?.uuid;
  const { journalUuid } = req.params;

  const freeze_time = req.query.freeze_time || String(Date.now());
  const fresh_load_pointer = req.query.fresh_load || 'Yes_Is_FreshLoad';


  const redisKey = `journal_feed:${journalUuid}:${freeze_time}:${fresh_load_pointer}`;

  try {
    const redisData = await redisClient.get(redisKey);
    if (redisData) {
      console.log(`⚡ Redis Hit: Serving journal feed [Time: ${freeze_time}] [Pointer: ${fresh_load_pointer}]`);
      return res.json(JSON.parse(redisData));
    }

    console.log(`🐢 Redis Miss: Fetching journal from Postgres [Time: ${freeze_time}] [Pointer: ${fresh_load_pointer}]`);


    const { journalFeedTasks, next_post_timestamp } = await fetchUserJournalFeed(
      journalUuid,
      logged_in_user_uuid,
      freeze_time,
      fresh_load_pointer
    ) as JournalFeedFetchResult;

    const responseData: JournalFeedResponseData = {
      tasks: journalFeedTasks,
      next_post_timestamp: next_post_timestamp || null,
      currentUserId: req.user?.id
    };

    await redisClient.set(redisKey, JSON.stringify(responseData), { EX: 300 });

    return res.json(responseData);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ ERROR IN [journalFeed Controller]:", errorMessage);
    next(err);
  }
};
