import React, { useState, useContext, useEffect } from "react";
import TaskContext from "../context/TaskContext.jsx";
import "../styles/Profile.css";
import api from "../api/axios.js";

const PendingRequest = () => {
  const {
    pendingRequests,
    Handle_Decline_Accept_Action,
    setPendingRequests,
    currentUserUuid,
  } = useContext(TaskContext);
  const [isOpen, setIsOpen] = useState(false);

  // ============Automatic_Fetch_Pending_Requests_On_Fresh_Load===================
  useEffect(() => {
    if (!currentUserUuid) return;
    // -------------------Fetch_Handler-----------------------------------
    const Automatic_fetch_Pending_Requests_Fresh_Load = async () => {
      try {
        const res = await api.get("/task/profile/pending-requests");
        setPendingRequests(res.data.requests);
        console.log(
          "📥 Historical pending requests successfully seeded:",
          res.data.requests,
        );
      } catch (err) {
        console.error(
          "❌ Failed to pull old pending follow requests:",
          err.message,
        );
      }
    };

    Automatic_fetch_Pending_Requests_Fresh_Load();
  }, [currentUserUuid, setPendingRequests]);
  // -----------------------------END----------------------------------

  // =====================View_All====================================
  if (!isOpen) {
    return pendingRequests.length > 0 ? (
      <div className="pending-requests-bar" onClick={() => setIsOpen(true)}>
        <span>{pendingRequests.length} Pending Requests</span>
        <span>View All</span>
      </div>
    ) : null;
  }
  // ---------------------END----------------------------------
  return (
    <div className="pending-dock open">
      <div className="dock-header">
        {/* ================Close_Button================================= */}
        <h2>🔒 Pending Requests ({pendingRequests.length})</h2>
        <button onClick={() => setIsOpen(false)}>Close</button>
        {/* // --------------------END---------------------------------- */}
      </div>

      {/* ================Pending_Request_Profiles======================== */}
      <div className="dock-list">
        {pendingRequests.map((request) => (
          <div key={request.followerUuid} className="request-card">
            <img
              src={request.avatarUrl || "https://placeholder.com"}
              alt="avatar"
              // ---------------------END----------------------------------
            />

            {/* ===================Profile_Names============================= */}
            <p>
              {request.firstName} {request.lastName}
              {/* ----------------------END------------------------------- */}
            </p>
            <div className="action-buttons">
              {/* =====Accept_&_Decline_Request_Handler =======================*/}
              <button
                onClick={() =>
                  Handle_Decline_Accept_Action(request.followerUuid, "accept")
                }
              >
                Accept
              </button>
              {/* --------------END------------------------ */}
              <button
                onClick={() =>
                  Handle_Decline_Accept_Action(request.followerUuid, "decline")
                }
              >
                Decline
              </button>
              {/* --------------END------------------------ */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequest;
