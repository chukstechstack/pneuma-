import redisClient from "@Terminal/Redis/redisCreateClient.js";
import { fetchGlobalTasksFeed } from "@Workshop/Payload/Mutations/getTaskService.js";
export const getTask = async (req, res, next) => {
    const current_User_uuid = req.user?.uuid;
    const user_Id = req.user?.id;
    const fresh_load_pointer = req.query.fresh_load || 'Yes_Is_FreshLoad';
    const redisFreshLoad = `tasks_feed:${current_User_uuid || 'guest'}:${fresh_load_pointer}`;
    try {
        const redisFreshLoadData = await redisClient.get(redisFreshLoad);
        if (redisFreshLoadData) {
            console.log(`⚡ Redis Hit: [Pointer: ${fresh_load_pointer}]`);
            return res.json(JSON.parse(redisFreshLoadData));
        }
        console.log(`🐢 Redis Miss: Querying Postgres [Pointer: ${fresh_load_pointer}]`);
        const { tasksFeed, next_post_timestamp } = await fetchGlobalTasksFeed(current_User_uuid, fresh_load_pointer);
        const responseData = {
            tasks: tasksFeed,
            next_post_timestamp: next_post_timestamp !== undefined && next_post_timestamp !== null ? String(next_post_timestamp) : null,
            currentUserId: user_Id,
            currentUserUuid: current_User_uuid
        };
        await redisClient.set(redisFreshLoad, JSON.stringify(responseData), { EX: 86400 });
        return res.json(responseData);
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=getTask.js.map