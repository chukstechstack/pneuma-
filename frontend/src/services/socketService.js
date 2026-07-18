// services/socketservice.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "https://pneuma-api-0bvr.onrender.com", {
  withCredentials: true,

}
);

export const setupSocketListeners = (queryClient) => {
  socket.onAny((eventName, ...args) => {
    console.log(`📡 DEBUG: Received event: ${eventName}`, args);
  });
  socket.on("incoming_connect_request", (payload) => {
    console.log("📥 Socket Event: incoming_connect_request", payload);
    queryClient.setQueryData(['pendingRequests'], (old = []) => [...old, payload]);
  });

  socket.on("unConnect_Status_Changes", (payload) => {
    console.log("🔄 Socket Event: unConnect_Status_Changes", payload);
    queryClient.setQueryData(['pendingRequests'], (old = []) =>
      old.filter(req => req.requested_User_Uuid !== payload.partner_Uuid)
    );

    updateProfileStatusCache(queryClient, payload.partner_Uuid, null);
  });


  socket.on("connection_updated_for_requested_user", (payload) => {
    console.log("🔄 Socket Event: connection_updated_for_requested_user", payload);
    updateProfileStatusCache(queryClient, payload.partner_Uuid, payload.newStatus);
  });

  socket.on("connection_status_updated_for_accepted_user", (payload) => {
    console.log("🔄 connection_status_updated_for_accepted_user", payload);
    updateProfileStatusCache(queryClient, payload.partner_Uuid, payload.newStatus);
  });

  // Inside setupSocketListeners in your frontend
  socket.on("test_event", (data) => {
    console.log("🔥 GLOBAL TEST RECEIVED:", data);
  });
};


const updateProfileStatusCache = (queryClient, targetUuid, newStatus) => {
  queryClient.setQueryData(['profile', targetUuid], (old) => {
    if (!old) return old;
    return { ...old, relationStatus: newStatus };
  });
};

export default socket;