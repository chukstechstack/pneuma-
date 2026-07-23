import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@api/axios.js";
import "@styles/Profile.css";

const Pending_Request = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ["pendingRequests"],

    queryFn: async () => {
      const res = await api.get("/task/profile/pending-requests");
      return res.data.requests;
    },
    staleTime: 1000 * 60 * 5,   
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onError: (err) => console.error("Fetch failed:", err),
  });

  const mutation = useMutation({
    mutationFn: async ({ targetUuid, action }) => {
      const res = await api.patch("/task/profile/request-action", {
        targetUuid,
        action,
      });
      return res.data.updatedRequests;
    },

    onMutate: async ({ targetUuid }) => {
      await queryClient.cancelQueries({ queryKey: ["pendingRequests"] });
      const previousRequests = queryClient.getQueryData(["pendingRequests"]);

      queryClient.setQueryData(["pendingRequests"], (old = []) =>
        old.filter((req) => req.requested_User_Uuid !== targetUuid),
      );

      return { previousRequests };
    },

    onSuccess: (updatedRequests) => {
      if (updatedRequests) {
        queryClient.setQueryData(["pendingRequests"], updatedRequests);
      }
    },

    onError: (err, variables, context) => {
      console.error("Mutation failed, rolling back:", err);
      if (context?.previousRequests) {
        queryClient.setQueryData(["pendingRequests"], context.previousRequests);
      }
    },
  });
  console.log("Current pendingRequests in UI:", pendingRequests);
  if (pendingRequests.length === 0) return null;

  if (!isOpen) {
    return (
      <div className="pending-requests-bar" onClick={() => setIsOpen(true)}>
        <span>{pendingRequests.length} Pending Requests</span>
        <span>View All</span>
      </div>
    );
  }

  return (
    <div className="pending-dock open">
      <div className="dock-header">
        <h2>🔒 Pending Requests ({pendingRequests.length})</h2>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
      <div className="dock-list">
        {pendingRequests.map((request) => (
          <div key={request.requested_User_Uuid} className="request-card">
            <img
              src={request.avatarUrl || "https://placeholder.com"}
              alt="avatar"
            />
            <p>
              {request.firstName} {request.lastName}
            </p>
            <div className="action-buttons">
              <button
                onClick={() =>
                  mutation.mutate({
                    targetUuid: request.requested_User_Uuid,
                    action: "accept",
                  })
                }
              >
                Accept
              </button>
              <button
                onClick={() =>
                  mutation.mutate({
                    targetUuid: request.requested_User_Uuid,
                    action: "decline",
                  })
                }
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pending_Request;
