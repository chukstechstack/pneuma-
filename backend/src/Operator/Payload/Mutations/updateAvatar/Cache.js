import redisClient from "@Terminal/Redis/redisCreateClient.js";
export const invalidateAvatarCache = async (userUuid) => {
    try {
        const profileCachePattern = `profile:*:${userUuid}*`;
        const cacheKeys = await redisClient.keys(profileCachePattern);
        if (cacheKeys.length > 0) {
            await redisClient.del(cacheKeys);
            console.log(`🧹 Avatar Cache Reset: Cleared ${cacheKeys.length} profile cache chunks.`);
        }
    }
    catch (cacheErr) {
        const cacheErrMsg = cacheErr instanceof Error ? cacheErr.message : String(cacheErr);
        console.error("⚠️ Non-critical Cache Clearing Error during avatar update:", cacheErrMsg);
    }
};
//# sourceMappingURL=Cache.js.map