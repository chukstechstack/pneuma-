
import socket from "@/api/socketApi.js"
export const setupSocketListeners = (queryClient) => {
  socket.onAny((eventName, ...args) => {
    console.log(`📡 DEBUG: Received event: ${eventName}`, args);
  });
  socket.on("incoming_connect_request", (payload) => {
    queryClient.setQueryData(['pendingRequests'], (old = []) => [...old, payload]);
    updateProfileStatusCache(queryClient, payload.requested_User_Uuid, "pending");
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