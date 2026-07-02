import React, { useState, useContext } from "react";
import TaskContext from "../context/TaskContext.jsx";
import "../styles/Profile.css";

const PendingRequest = () => {
  const { pendingRequests, Handle_Decline_Accept_Action } =
    useContext(TaskContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return pendingRequests.length > 0 ? (
      <div className="pending-requests-bar" onClick={() => setIsOpen(true)}>
        <span>{pendingRequests.length} Pending Requests</span>
        <span>View All</span>
      </div>
    ) : null;
  }

  return (
    <div className="pending-dock open">
      <div className="dock-header">
        <h2>🔒 Pending Requests ({pendingRequests.length})</h2>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>

      <div className="dock-list">
        {pendingRequests.map((request) => (
          <div key={request.followerUuid} className="request-card">
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
                  Handle_Decline_Accept_Action(request.followerUuid, "accept")
                }
              >
                Accept
              </button>
              <button
                onClick={() =>
                  Handle_Decline_Accept_Action(request.followerUuid, "decline")
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

export default PendingRequest;
