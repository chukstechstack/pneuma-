import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthHome from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import HomePage from "./pages/Home.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import PatchFeed from "./pages/PatchFeed.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import Profile from "./pages/Profile.jsx";
import JournalPage from "./pages/JournalFeed.jsx";
import Pending_Request from "./components/pending-Requests.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
const App = () => {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/createtask" element={<CreateTask />} />
          <Route path="/patchfeed/:uuid" element={<PatchFeed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:targetProfileUuid" element={<Profile />} />
          <Route path="/pending-requests" element={<Pending_Request />} />
          <Route path="/NotificationsPage" element={<NotificationsPage />} />
          <Route
            path="/journalfeed/:targetUserUuid"
            element={<JournalPage />}
          />
        </Routes>
      </Router>
    </TaskProvider>
  );
};

export default App;
