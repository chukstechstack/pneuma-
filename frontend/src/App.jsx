import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthHome from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx"; //  Added .jsx extension
import Register from "./pages/Register.jsx";
import HomePage from "./pages/Home.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import EditPost from "./pages/EditTask.jsx";
import { TaskProvider } from "./context/TaskContext.jsx"; // Added .jsx extension just in case
import ProfilePageLog from "./pages/Profile.jsx"; //  Renamed import variable to prevent compilation confusion
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
          <Route path="/edittask/:uuid" element={<EditPost />} />
          <Route path="/profile" element={<ProfilePageLog />} />{" "}
          <Route path="/journalfeed/:journalUuid" element={<JournalPage />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
};

export default App;
