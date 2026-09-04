import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage/LandingPage";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import HomeFeed from "@pages/HomeFeed/HomeFeed";
import CreateTask from "@/pages/CreateTask/CreateTask";
import PatchFeed from "@/pages/PatchFeed/PatchFeed";
import Profile from "@/pages/Profile/Profile";
import JournalPage from "@/pages/JournalFeed/Feed";
import TermsPage from "./pages/Terms&Conditions/TermsPage";
import UpdatePassword from "../src/pages/UpdatePassword/UpdatePassword";
import ForgotPassword from "./components/Login/ForgotPassword";
import { TaskDetailView } from "@/pages/TaskDetailView/TaskDetailView"; 
import { SocketWatcher } from "@/services/SocketWatcher/SocketWatcher";
import { AuthenticatedGuard } from "@/components/AuthenticateGuard/AuthenticatedGuard";
import { LoadingScreen } from "./pages/LandingPage/Component/LoadingScreen";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    // 🌟 Changed from h-screen overflow-hidden to min-h-screen w-full so the page can scroll normally
    <div className="min-h-screen w-full text-white relative selection:bg-emerald-500 selection:text-black bg-[#070709]">
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div className={`min-h-screen w-full transition-opacity duration-500 ease-out ${isLoading ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <SocketWatcher />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/updatepassword" element={<UpdatePassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/termspage" element={<TermsPage />} />

            <Route element={<AuthenticatedGuard><Outlet /></AuthenticatedGuard>}>
              <Route path="/homefeed" element={<HomeFeed />} />
              <Route path="/createtask" element={<CreateTask />} />
              <Route path="/patchfeed/:uuid" element={<PatchFeed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:targetProfileUuid" element={<Profile />} />
              <Route path="/feed/:targetUserUuid" element={<JournalPage />} />
              <Route path="/task/:taskId" element={<TaskDetailView />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;