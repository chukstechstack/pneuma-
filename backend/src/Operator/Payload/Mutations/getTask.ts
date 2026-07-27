import redisClient from "@Terminal/Redis/redisCreateClient.js";
import { fetchGlobalTasksFeed } from "@Workshop/Payload/Mutations/getTaskService.js";
import type { Request, Response, NextFunction } from "express";

interface GetTaskQuery {
  freeze_time?: string;
  fresh_load?: string;
}

interface AuthenticatedRequest extends Request<Record<string, string>, unknown, unknown, GetTaskQuery> {
  user?: {
    id?: number | string;
    uuid?: string;
  };
}

interface TaskResponseData {
  tasks: unknown[];
  next_post_timestamp: string | null;
  currentUserId: number | string | undefined;
  currentUserUuid: string | undefined;
}

export const getTask = async (
  req: AuthenticatedRequest,
  res: Response<TaskResponseData | { error: string }>,
  next: NextFunction
) => {
  const user_uuid = req.user?.uuid;
  const user_Id = req.user?.id;

  const freeze_time = req.query.freeze_time || String(Date.now());
  const fresh_load_pointer = req.query.fresh_load || 'Yes_Is_FreshLoad';

  const redisFreshLoad = `tasks_feed:${user_uuid || 'guest'}:${freeze_time}:${fresh_load_pointer}`;

  try {
    const redisFreshLoadData = await redisClient.get(redisFreshLoad);
    if (redisFreshLoadData) {
      console.log(`⚡ Redis Hit: [Time Snapshot: ${freeze_time}] [Pointer: ${fresh_load_pointer}]`);
      return res.json(JSON.parse(redisFreshLoadData) as TaskResponseData);
    }

    console.log(`🐢 Redis Miss: Querying Postgres [Time Snapshot: ${freeze_time}] [Pointer: ${fresh_load_pointer}]`);

    const { tasksFeed, next_post_timestamp } = await fetchGlobalTasksFeed(
      user_uuid, 
      freeze_time, 
      fresh_load_pointer
    );

    const responseData: TaskResponseData = {
      tasks: tasksFeed,
      next_post_timestamp: next_post_timestamp !== undefined && next_post_timestamp !== null ? String(next_post_timestamp) : null,
      currentUserId: user_Id,
      currentUserUuid: user_uuid
    };

    await redisClient.set(redisFreshLoad, JSON.stringify(responseData), { EX: 86400 });

    return res.json(responseData);
  } catch (err: unknown) {
    next(err);
  }
};