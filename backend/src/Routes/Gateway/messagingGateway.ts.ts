import { Server, Socket } from "socket.io";
import pool from "@/Terminal/Supabase/supabaseConfig.js";
import { UserUuidPayload } from "@shared/types.js";

interface SendMessagePayload {
  recipientUuid: string;
  content: string;
  tempId: string;
}

export const registerMessagingGateway = (socketServerCors: Server, socket: Socket) => {
  let connectedUserUuid: string | null = null;

  // 1. Authenticate & Join Private Room
  socket.on("current_Logged_In_User_Uuid", (data: UserUuidPayload) => {
    const { userUuid } = data;
    if (userUuid) {
      connectedUserUuid = userUuid;
      socket.join(`current_Logged_In_User_Uuid:${userUuid}`);
      console.log(`🔒 Secure room locked for User UUID: ${userUuid} on Socket: ${socket.id}`);
    }
  });

  // 2. Real-Time Messaging Event
  socket.on("client:send_message", async (data: SendMessagePayload) => {
    const { recipientUuid, content, tempId } = data;
    const senderUuid = connectedUserUuid;

    if (!senderUuid || !recipientUuid || !content?.trim()) {
      socket.emit("server:message_error", { 
        tempId, 
        error: "Invalid message payload or missing sender authentication." 
      });
      return;
    }

    const createdAt = new Date().toISOString();

    // ⚡ STEP A: INSTANT SOCKET BROADCAST (Zero Latency)
    socketServerCors.to(`current_Logged_In_User_Uuid:${recipientUuid}`).emit("server:receive_message", {
      tempId,
      senderUuid,
      content,
      createdAt,
    });

    // 🐢 STEP B: BACKGROUND DB PERSISTENCE (Direct UUID Insertion)
    try {
      const dbRes = await pool.query(
        `INSERT INTO messages (sender_uuid, recipient_uuid, content, created_at) 
         VALUES ($1, $2, $3, NOW()) 
         RETURNING id, created_at`,
        [senderUuid, recipientUuid, content]
      );

      const savedMessage = dbRes.rows[0];

      // Confirm saved state back to sender
      socket.emit("server:message_acknowledged", {
        tempId,
        messageId: savedMessage.id,
        createdAt: savedMessage.created_at,
      });
    } catch (dbError) {
      console.error("❌ DB Persist Failed:", dbError);
      socket.emit("server:message_error", {
        tempId,
        error: "Message delivered live but failed to save to database.",
      });
    }
  });
};