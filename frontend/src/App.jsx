import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthHome from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import HomePage from "./pages/Home.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import PatchFeed from "./pages/PatchFeed.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import ProfilePageLog from "./pages/Profile.jsx";
import JournalPage from "./pages/JournalFeed.jsx";
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
          <Route path="/profile" element={<ProfilePageLog />} /> // Change this
          <Route
            path="/journalfeed/:cuurent_User_privateFeed_post_Uuid"
            element={<JournalPage />}
          />
        </Routes>
      </Router>
    </TaskProvider>
  );
};

export default App;
