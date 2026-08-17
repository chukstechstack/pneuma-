import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {LandingPage}  from "@/pages/LandingPage/LandingPage"
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import HomeFeed from "@pages/HomeFeed/HomeFeed";
import CreateTask from "@/pages/CreateTask/CreateTask";
import PatchFeed from "@/pages/PatchFeed/PatchFeed";
import Profile from "@/pages/Profile/Profile";
import Pending_Request from "@/pages/PendingRequest/PendingRequest";
import JournalPage from "@/pages/JournalFeed/Feed";

import { SocketWatcher } from "@/components/SocketWatcher/SocketWatcher";
import { AuthenticatedGuard } from "@/components/AuthenticateGuard/AuthenticatedGuard";
import { PresenceContainer } from "@/components/PresenceContainer/PresenceContainer";



const App = () => {
  return (
    <>
      <SocketWatcher />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <AuthenticatedGuard>
                <PresenceContainer />
              </AuthenticatedGuard>
            }
          >
            <Route path="/homefeed" element={<HomeFeed />} />
            <Route path="/createtask" element={<CreateTask />} />
            <Route path="/patchfeed/:uuid" element={<PatchFeed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:targetProfileUuid" element={<Profile />} />
            <Route path="/pending-requests" element={<Pending_Request />} />
            <Route path="/feed/:targetUserUuid" element={<JournalPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;