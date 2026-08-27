import redisClient from "@Terminal/Redis/redisCreateClient.js";

export const invalidateAllTaskCaches = async () => {
  try {
    console.log(`🧹 [Redis] Starting global task & journal cache wipe...`);
    const homeKeys = await redisClient.keys("tasks_feed:*");
    const journalKeys = await redisClient.keys("journal_feed_cache:*");
    
    const allKeys = [...homeKeys, ...journalKeys];
    if (allKeys.length > 0) {
      await redisClient.del(allKeys);
      console.log(`✨ [Redis] Global Cache Reset: Successfully deleted ${allKeys.length} keys.`);
    } else {
      console.log(`ℹ️ [Redis] No active feed keys found to clear.`);
    }
  } catch (cacheErr: unknown) {
    console.error("⚠️ [Redis Error] Error in global cache-busting:", cacheErr);
  }
};