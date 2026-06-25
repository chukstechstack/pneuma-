import React, { useContext } from "react";
import { Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import "../styles/Profile.css";

// 1. Defined here so it stays in the same file
const PendingRequestsBar = () => {
  const { pendingRequests } = useContext(TaskContext);

  // Optional: Hide the bar completely if there are no requests
  if (pendingRequests.length === 0) return null;

  return (
    <Link to="/pending-requests" className="pending-requests-link-wrapper">
      <div className="pending-requests-bar">
        <span>Follow Requests</span>
        <span className="requests-count-badge">{pendingRequests.length}</span>
      </div>
    </Link>
  );
};

// 2. The main page component
const NotificationsPage = () => {
  return (
    <div className="notifications-page-container">
      <PendingRequestsBar />

      <div className="general-activity-section">
        <h3>Recent Activity</h3>
        <p>No new activity notifications.</p>
      </div>
    </div>
  );
};

export default NotificationsPage;
