import React from "react";
import { Outlet } from "react-router-dom";

export const PresenceContainer = () => (
  <div className="app-container">
    <div className="main-content-slot">
      {/* 🔮 Renders the active child page route (like your Feed or Profile) */}
      <Outlet />
    </div>
  </div>
);
