import redisClient from "@Terminal/Redis/redisCreateClient.js";
export const invalidatePatchCaches = async (userUuid) => {
    try {
        const homeFeedPattern = `tasks_feed:${userUuid}:*`;
        const homeKeys = await redisClient.keys(homeFeedPattern);
        if (homeKeys.length > 0) {
            await redisClient.del(homeKeys);
            console.log(`🧹 Cache Reset: Swept away ${homeKeys.length} paginated home feed chunks.`);
        }
        const journalPattern = `journal_feed_cache:${userUuid}:*`;
        const journalKeys = await redisClient.keys(journalPattern);
        if (journalKeys.length > 0) {
            await redisClient.del(journalKeys);
            console.log(`🧹 Cache Reset: Swept away ${journalKeys.length} paginated private feed chunks.`);
        }
    }
    catch (cacheErr) {
        const cacheErrMsg = cacheErr instanceof Error ? cacheErr.message : String(cacheErr);
        console.error("⚠️ Non-critical Error in cache-busting invalidation process:", cacheErrMsg);
    }
};
//# sourceMappingURL=patchTaskCache.js.map