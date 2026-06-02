import redisClient from "../../config/redisCreateClient.js";
import { fetchGlobalTasksFeed } from "../../services/task/getTaskService.js";

export const getTask = async (req, res, next) => {

  // Grab the Uuid from deserialized User from passprt to query my Database for the id of the profile user
  const user_uuid = req.user?.uuid;
// Grab the Uuid from deserialized User id to send to the frontend
  const user_numeric_id = req.user?.id;

  // 2. Use the UUID string for your Redis cache key so new users don't get mixed up as 'guest'
  const cacheKey = `tasks_feed:${user_uuid || 'guest'}`;

  try {
    // 3. Check Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Redis Hit: Serving feed from cache");
      return res.json(JSON.parse(cachedData));
    }

    console.log("🐢 Redis Miss: Fetching from Postgres");

    // 4. Fetch tasks from the database using the uuid string
    const tasksFeed = await fetchGlobalTasksFeed(user_uuid);

    // 5. Send back currentUserId as the numeric ID so your frontend context doesn't break!
    const responseData = {
      tasks: tasksFeed,
      currentUserId: user_numeric_id,
      currentUserUuid: user_uuid
    };

    // 6. Save to Redis cache
    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 600 });

    return res.json(responseData);
  } catch (err) {
    next(err);
  }
};
