import React, { useContext } from "react";
import TaskContext from "../context/TaskContext.jsx";

const Pending_Request = () => {
  const { pendingRequests, setPendingRequests } = useContext(TaskContext);

  
  if (pendingRequests.length === 0) {
    return (
      <div>
        <p> No pending requests</p>
      </div>
    );
  }
  return (
    <div>
      <h2> 🔒 Pending Requests ({pendingRequests.length})</h2>
      <div>
        {pendingRequests.map((request) => (
          <div key={request.followerUuid}>
            <div>
              <img
                src={request.avatarUrl || "https://placeholder.com"}
                alt="profile avatar"
              />
            </div>
            <p>
              {request.firstName} {request.lastName}
            </p>
            <p> Wants to Follow your scrolls </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pending_Request;
