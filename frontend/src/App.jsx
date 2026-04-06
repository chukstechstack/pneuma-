import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthHome from "./pages/auth/AuthHome";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import HomePage from "./components/taskhome/Home.jsx";
import CreateTask from "./components/createtask/Createtask.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthHome />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="taskhome/home" element={<HomePage />} />
        <Route path="/createtask" element={<CreateTask />} />
      </Routes>
    </Router>
  );
};

export default App;
