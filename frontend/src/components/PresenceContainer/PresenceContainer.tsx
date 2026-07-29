import React from "react";
import { Outlet } from "react-router-dom";
import Pending_Request from "@pages/PendingRequest/PendingRequest";

export const PresenceContainer = () => (
  <div className="app-container">
    <div className="presence-notification-slot">
      <Pending_Request />
    </div>
    <div className="main-content-slot">
      <Outlet />
    </div>
  </div>
);