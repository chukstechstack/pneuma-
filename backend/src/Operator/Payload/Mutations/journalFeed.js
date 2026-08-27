import redisClient from "@/Terminal/Redis/redisCreateClient.js";
import { fetchUserJournalFeed } from "@/Workshop/Payload/Mutations/journalFeed.js";
export const journalFeed = async (req, res, next) => {
    const logged_in_user_uuid = req.user?.uuid;
    const { targetUserUuid } = req.params;
    const fresh_load_pointer = req.query.fresh_load || 'Yes_Is_FreshLoad';
    console.log("targetUser" + targetUserUuid);
    // Use a unique cache namespace for the journal feed to avoid home feed collisions
    const redisFreshLoad = `journal_feed_cache:${targetUserUuid || 'guest'}:${fresh_load_pointer}`;
    try {
        const redisData = await redisClient.get(redisFreshLoad);
        if (redisData) {
            console.log(`⚡ Redis Hit: Serving journal feed [Target: ${targetUserUuid}] [Pointer: ${fresh_load_pointer}]`);
            return res.json(JSON.parse(redisData));
        }
        console.log(`🐢 Redis Miss: Fetching journal from Postgres [Target: ${targetUserUuid}] [Pointer: ${fresh_load_pointer}]`);
        const { journalFeedTasks, next_post_timestamp } = await fetchUserJournalFeed(targetUserUuid, logged_in_user_uuid, fresh_load_pointer);
        const responseData = {
            tasks: journalFeedTasks,
            next_post_timestamp: next_post_timestamp || null,
            currentUserId: req.user?.id,
            currentUserUuid: req.user?.uuid,
        };
        await redisClient.set(redisFreshLoad, JSON.stringify(responseData), { EX: 300 });
        return res.json(responseData);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("❌ ERROR IN [journalFeed Controller]:", errorMessage);
        next(err);
    }
};
//# sourceMappingURL=journalFeed.js.map