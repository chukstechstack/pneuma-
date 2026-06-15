import pool from "../../config/supabaseConfig.js";
import redisClient from "../../config/redisCreateClient.js";
import { fetchUserJournalFeed } from "../../services/task/journalFeed.js"; 

export const journalFeed = async (req, res, next) => {
  const logged_in_user_uuid = req.user?.uuid; 
  const { journalUuid } = req.params;         

  // 1. Unpack the exact matching pagination parameters from the URL query strings
  const freeze_time = req.query.freeze_time || String(Date.now());
  const fresh_load_pointer = req.query.fresh_load || 'Yes_Is_FreshLoad';

  // 2. FIXED CACHE KEY: Include the timestamps so distinct pages stay in separate Redis folders!
  const redisKey = `journal_feed:${journalUuid}:${freeze_time}:${fresh_load_pointer}`;

  try {
    const redisData = await redisClient.get(redisKey);
    if (redisData) {
      console.log(`⚡ Redis Hit: Serving journal feed [Time: ${freeze_time}] [Pointer: ${fresh_load_pointer}]`);
      return res.json(JSON.parse(redisData));
    }

    console.log(`🐢 Redis Miss: Fetching journal from Postgres [Time: ${freeze_time}] [Pointer: ${fresh_load_pointer}]`);

    // 3. Pass your parameters down into your underlying database data query service
    const { journalFeedTasks, next_post_timestamp } = await fetchUserJournalFeed(
      journalUuid, 
      logged_in_user_uuid,
      freeze_time,
      fresh_load_pointer
    );

    const responseData = { 
      tasks: journalFeedTasks, 
      next_post_timestamp: next_post_timestamp || null, // 🎯 Crucial token for your frontend scroll listener
      currentUserId: req.user?.id 
    };

    // Save the results to Redis for 5 minutes (300 seconds) to maintain a lightweight memory footprint
    await redisClient.set(redisKey, JSON.stringify(responseData), { EX: 300 });

    return res.json(responseData);
  } catch (err) {
    console.error("❌ ERROR IN [journalFeed Controller]:", err.message);
    next(err);
  }
};
