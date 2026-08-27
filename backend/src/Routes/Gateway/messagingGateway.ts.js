import pool from "@/Terminal/Supabase/supabaseConfig.js";
export const registerMessagingGateway = (socketServerCors, socket) => {
    let connectedUserUuid = null;
    // 1. Authenticate & Join Private Room
    socket.on("current_Logged_In_User_Uuid", (data) => {
        const { userUuid } = data;
        if (userUuid) {
            connectedUserUuid = userUuid;
            socket.join(`current_Logged_In_User_Uuid:${userUuid}`);
            console.log(`🔒 Secure room locked for User UUID: ${userUuid} on Socket: ${socket.id}`);
        }
    });
    // 2. Real-Time Messaging Event
    socket.on("client:send_message", async (data) => {
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
        // ⚡ STEP A: INSTANT SOCKET BROADCAST (Zero Latency) -> Matches frontend "server:incoming_msg"
        socketServerCors.to(`current_Logged_In_User_Uuid:${recipientUuid}`).emit("server:incoming_msg", {
            tempId,
            senderUuid,
            content,
            createdAt,
        });
        // 🐢 STEP B: BACKGROUND DB PERSISTENCE (Resolve UUIDs to Integer IDs & Insert)
        try {
            // Look up integer IDs for both sender and recipient using their UUIDs
            const userLookup = await pool.query(`SELECT uuid, id FROM profiles WHERE uuid = ANY($1::uuid[])`, [[senderUuid, recipientUuid]]);
            const idMap = new Map(userLookup.rows.map(row => [row.uuid, row.id]));
            const senderIntId = idMap.get(senderUuid);
            const recipientIntId = idMap.get(recipientUuid);
            if (!senderIntId || !recipientIntId) {
                throw new Error("Sender or recipient profile ID not found in database.");
            }
            // Insert using sender_id and recipient_id as expected by your foreign keys
            const dbRes = await pool.query(`INSERT INTO messages (sender_id, recipient_id, content, created_at) 
         VALUES ($1, $2, $3, NOW()) 
         RETURNING id, created_at`, [senderIntId, recipientIntId, content]);
            const savedMessage = dbRes.rows[0];
            // Confirm saved state back to sender -> Matches frontend "server:outgoing_msg_confirmed"
            socket.emit("server:outgoing_msg_confirmed", {
                tempId,
                messageId: savedMessage.id,
                createdAt: savedMessage.created_at,
            });
        }
        catch (dbError) {
            console.error("❌ DB Persist Failed:", dbError);
            socket.emit("server:message_error", {
                tempId,
                error: "Message delivered live but failed to save to database.",
            });
        }
    });
};
//# sourceMappingURL=messagingGateway.ts.js.map