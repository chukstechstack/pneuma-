import { useEffect } from "react";
import { queryClient } from "@/api/queryClient";

import socket from "@/api/socketApi";
import { useAuthStore } from "@store/useAuthStore";
import { UserUuidPayload } from "@shared/types";

export const SocketWatcher = () => {
  const { userUuid } = useAuthStore() as { userUuid: string | null };

  useEffect(() => {
    if (!userUuid) return;

    const onConnect = () => {
      console.log("✅ Socket Connected! ID:", socket.id);

      const payload: UserUuidPayload = { userUuid };
      socket.emit("current_Logged_In_User_Uuid", payload);
      console.log("📤 Emitting UUID:", userUuid);
    };

    socket.on("connect", onConnect);

    if (socket.connected) {
      console.log("⚡ Already connected, emitting UUID directly");

      const payload: UserUuidPayload = { userUuid };
      
      socket.emit("current_Logged_In_User_Uuid", payload);
      console.log(" User Emmited", { userUuid });
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, [userUuid]);

  return null;
};