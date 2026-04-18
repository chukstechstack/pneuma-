import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthHome from "./pages/AuthHome.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/Home.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import EditPost from "./pages/EditTask.jsx";
import {TaskProvider} from "./context/TaskContext";

const App = () => {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthHome />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/taskhome/home" element={<HomePage />} />
          <Route path="/createtask" element={<CreateTask />} />
          <Route path="/edittask/:uuid" element={<EditPost />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
};

export default App;
