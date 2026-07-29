
import socket from "@/api/socketApi.js"
import { QueryClient } from "@tanstack/react-query"

interface ConnectRequestPayload {
  requested_User_Uuid: string;
  [key: string]: unknown;
}

interface DisconnectStatusPayload {
  partner_Uuid: string;
  [key: string]: unknown;
}

interface ConnectionStatusPayload {
  partner_Uuid: string;
  newStatus: string | null;
  [key: string]: unknown;
}

interface ProfileCache {
  relationStatus?: string | null;
  [key: string]: unknown;
}

export const setupSocketListeners = (queryClient: QueryClient): void => {
  socket.onAny((eventName: string, ...args: unknown[]): void => {
    console.log(`📡 DEBUG: Received event: ${eventName}`, args);
  });
  socket.on("incoming_connect_request", (payload: ConnectRequestPayload): void => {
    queryClient.setQueryData(['pendingRequests'], (old: ConnectRequestPayload[] = []) => [...old, payload]);
    updateProfileStatusCache(queryClient, payload.requested_User_Uuid, "pending");
  });

  socket.on("unConnect_Status_Changes", (payload: DisconnectStatusPayload): void => {
    console.log("🔄 Socket Event: unConnect_Status_Changes", payload);
    queryClient.setQueryData(['pendingRequests'], (old: ConnectRequestPayload[] = []) =>
      old.filter(req => req.requested_User_Uuid !== payload.partner_Uuid)
    );

    updateProfileStatusCache(queryClient, payload.partner_Uuid, null);
  });


  socket.on("connection_updated_for_requested_user", (payload: ConnectionStatusPayload): void => {
    console.log("🔄 Socket Event: connection_updated_for_requested_user", payload);
    updateProfileStatusCache(queryClient, payload.partner_Uuid, payload.newStatus);
  });

  socket.on("connection_status_updated_for_accepted_user", (payload: ConnectionStatusPayload): void => {
    console.log("🔄 connection_status_updated_for_accepted_user", payload);
    updateProfileStatusCache(queryClient, payload.partner_Uuid, payload.newStatus);
  });


  socket.on("test_event", (data: unknown): void => {
    console.log("🔥 GLOBAL TEST RECEIVED:", data);
  });
};


const updateProfileStatusCache = (queryClient: QueryClient, targetUuid: string, newStatus: string | null): void => {
  queryClient.setQueryData(['profile', targetUuid], (old: ProfileCache | undefined) => {
    if (!old) return old;
    return { ...old, relationStatus: newStatus };
  });
};

export default socket;