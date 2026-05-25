import pool from "../../config/supabaseConfig.js";
import redisClient from "../../config/redisCreateClient.js";
import { fetchUserJournalFeed } from "../../services/task/journalFeed.js"; 

export const journalFeed = async (req, res, next) => {
  const logged_in_user_uuid = req.user?.uuid; 
  const { journalUuid } = req.params;         

  // 1. Create a custom Redis cache key specifically for this profile's journal page
  const cacheKey = `journal_feed:${journalUuid}:viewer:${logged_in_user_uuid || 'guest'}`;

  try {
    // 2. Check Redis cache first so user profiles load instantly
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Redis Hit: Serving journal feed from cache");
      return res.json(JSON.parse(cachedData));
    }

    console.log("🐢 Redis Miss: Fetching journal from Postgres");

    // 3. Call your service function to run the database search query
    const journalTasks = await fetchUserJournalFeed(journalUuid, logged_in_user_uuid);

    const responseData = { 
      tasks: journalTasks, 
      currentUserId: req.user?.id 
    };

    // 4. Save the results to Redis for 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 600 });

    return res.json(responseData);
  } catch (err) {
    console.error("❌ ERROR IN [journalFeed Controller]:", err.stack || err.message);
    next(err);
  }
};
