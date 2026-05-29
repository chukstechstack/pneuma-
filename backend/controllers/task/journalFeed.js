import pool from "../../config/supabaseConfig.js";
import redisClient from "../../config/redisCreateClient.js";
import { fetchUserJournalFeed } from "../../services/task/journalFeed.js"; 

export const journalFeed = async (req, res, next) => {
  const logged_in_user_uuid = req.user?.uuid; 
  const { journalUuid } = req.params;         

  // 🎯 THE FIXED MATCHING KEY: No more viewer strings!
  const cacheKey = `journal_feed:${journalUuid}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Redis Hit: Serving journal feed from clean cache");
      return res.json(JSON.parse(cachedData));
    }

    console.log("🐢 Redis Miss: Fetching journal from Postgres");

    const journalTasks = await fetchUserJournalFeed(journalUuid, logged_in_user_uuid);

    const responseData = { 
      tasks: journalTasks, 
      currentUserId: req.user?.id 
    };

    // Save the results to Redis for 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 600 });

    return res.json(responseData);
  } catch (err) {
    console.error("❌ ERROR IN [journalFeed Controller]:", err.message);
    next(err);
  }
};
