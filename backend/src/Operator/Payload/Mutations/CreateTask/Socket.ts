import type { PoolClient } from "pg";
import type { Server } from "socket.io";

export const broadcastNewPost = async (
  io: Server | undefined,
  dbClient: PoolClient,
  userUuid: string,
  taskId: number | string
) => {
  try {
    const connectionsResult = await dbClient.query<{ connection_uuid: string }>(
      `SELECT 
         CASE 
           WHEN connector_uuid = $1 THEN connected_uuid 
           ELSE connector_uuid 
         END AS connection_uuid 
       FROM connections 
       WHERE (connector_uuid = $1 OR connected_uuid = $1)`,
      [userUuid]
    );
    
    const connectionUuids = connectionsResult.rows.map(r => r.connection_uuid);
    console.log(`🔍 [Socket] Author ${userUuid} has ${connectionUuids.length} connection rooms to notify.`);

    if (connectionUuids.length > 0 && io) {
      io.to(connectionUuids).emit("server:new_post_available", {
        authorUuid: userUuid,
        taskId: taskId,
      });
      console.log(`📡 [Socket] Broadcasted 'server:new_post_available' to rooms:`, connectionUuids);
    } else {
      console.log(`⚠️ [Socket] No active connection rooms found or socket server missing.`);
    }
  } catch (socketErr) {
    console.error("⚠️ [Socket Error] Non-critical socket emission error on post creation:", socketErr);
  }
};