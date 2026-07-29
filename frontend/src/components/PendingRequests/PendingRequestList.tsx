import React from "react";
import { PendingRequest } from "./PendingRequest.types";

interface PendingRequestListProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pendingRequests: PendingRequest[];
  onAction: (targetUuid: string, action: string) => void;
}

export const PendingRequestList: React.FC<PendingRequestListProps> = ({
  isOpen,
  setIsOpen,
  pendingRequests,
  onAction,
}) => {
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
            <img src={request.avatarUrl || "https://placeholder.com"} alt="avatar" />
            <p>
              {request.firstName} {request.lastName}
            </p>
            <div className="action-buttons">
              <button onClick={() => onAction(request.requested_User_Uuid, "accept")}>Accept</button>
              <button onClick={() => onAction(request.requested_User_Uuid, "decline")}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};