import { useEffect } from "react";
import socket from "@/api/socketApi";
import { useAuthStore } from "@store/useAuthStore";
import { UserUuidPayload } from "@shared/types";

export const SocketWatcher = () => {
  const { userUuid } = useAuthStore() as { userUuid: string | null };

  useEffect(() => {
    if (!userUuid) return;

    const onConnect = () => {
      console.log("✅ Socket Connected! ID:", socket.id);

      // 1. Keep your existing messaging/chat dock channel happy
      const payload: UserUuidPayload = { userUuid };
      socket.emit("current_Logged_In_User_Uuid", payload);
      console.log("📤 Emitted current_Logged_In_User_Uuid:", userUuid);

      // 2. Also emit join_user_room so your alerts & feed broadcast rooms populate
      socket.emit("join_user_room", userUuid);
      console.log("🏠 Emitted join_user_room:", userUuid);
    };

    socket.on("connect", onConnect);

    if (socket.connected) {
      console.log("⚡ Already connected, emitting user UUIDs directly");

      const payload: UserUuidPayload = { userUuid };
      socket.emit("current_Logged_In_User_Uuid", payload)
      
      socket.emit("join_user_room", userUuid);
      console.log("⚡ Emitted both UUID events for:", userUuid);
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, [userUuid]);

  return null;
};