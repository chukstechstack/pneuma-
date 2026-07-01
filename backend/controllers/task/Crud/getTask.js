import redisClient from "../../../config/redisCreateClient.js";
import { fetchGlobalTasksFeed } from "../../../services/task/getTaskService.js";

export const getTask = async (req, res, next) => {
  const user_uuid = req.user?.uuid;
  const user_Id = req.user?.id;

  // 1. Fixed parameter casing to match your frontend URL exactly (Fresh_Load)
  const freeze_time = req.query.freeze_time || String(Date.now());
  const fresh_load_pointer = req.query.fresh_load || 'Yes_Is_FreshLoad';

  // 2. Clear, structured redis cache key name
  const redisFreshLoad = `tasks_feed:${user_uuid || 'guest'}:${freeze_time}:${fresh_load_pointer}`;

  try {
    // 3. Check specific Redis pagination drawer
    const redisFreshLoadData = await redisClient.get(redisFreshLoad);
    if (redisFreshLoadData) {
      console.log(`⚡ Redis Hit: [Time Snapshot: ${freeze_time}] [Pointer: ${fresh_load_pointer}]`);
      return res.json(JSON.parse(redisFreshLoadData));
    }

    console.log(`🐢 Redis Miss: Querying Postgres [Time Snapshot: ${freeze_time}] [Pointer: ${fresh_load_pointer}]`);

    // 4. Fetch data batch from your underlying postgres data service
    const { tasksFeed, next_post_timestamp } = await fetchGlobalTasksFeed(user_uuid, freeze_time, fresh_load_pointer);

    const responseData = {
      tasks: tasksFeed,
      next_post_timestamp: next_post_timestamp || null,
      currentUserId: user_Id,
      currentUserUuid: user_uuid
    };

    // 5. Fixed variable target to use your updated redisFreshLoad name
    await redisClient.set(redisFreshLoad, JSON.stringify(responseData), { EX: 86400 });

    return res.json(responseData);
  } catch (err) {
    next(err);
  }
};
