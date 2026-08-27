import type { Server } from "socket.io";

export const broadcastTaskUpdate = async (
  io: Server | undefined,
  uuid: string,
  updatedRows: unknown
) => {
  try {
    if (io) {
      io.emit("server:task_updated", {
        taskId: uuid,
        updatedTask: updatedRows,
      });
      console.log(`📡 Broadcasted server:task_updated for task UUID: ${uuid}`);
    }
  } catch (socketErr) {
    console.error("⚠️ Non-critical Error in socket emission for task update:", socketErr);
  }
};

