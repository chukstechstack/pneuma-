export const broadcastNewPost = async (io, dbClient, userUuid, taskId) => {
    try {
        const connectionsResult = await dbClient.query(`SELECT 
         CASE 
           WHEN connector_uuid = $1 THEN connected_uuid 
           ELSE connector_uuid 
         END AS connection_uuid 
       FROM connections 
       WHERE (connector_uuid = $1 OR connected_uuid = $1)`, [userUuid]);
        const connectionUuids = connectionsResult.rows.map(r => r.connection_uuid);
        console.log(`🔍 [Socket] Author ${userUuid} has ${connectionUuids.length} connection rooms to notify.`);
        if (connectionUuids.length > 0 && io) {
            io.to(connectionUuids).emit("server:new_post_available", {
                authorUuid: userUuid,
                taskId: taskId,
            });
            console.log(`📡 [Socket] Broadcasted 'server:new_post_available' to rooms:`, connectionUuids);
        }
        else {
            console.log(`⚠️ [Socket] No active connection rooms found or socket server missing.`);
        }
    }
    catch (socketErr) {
        console.error("⚠️ [Socket Error] Non-critical socket emission error on post creation:", socketErr);
    }
};
//# sourceMappingURL=Socket.js.map