import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useInitializeUser } from "./hooks/useInitializeUser";
import socket, { setupSocketListeners } from "./services/socketservice.js";
import { queryClient } from "./api/queryClient";

import Pending_Request from "./components/pending-Requests.jsx";
import AuthHome from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import HomePage from "./pages/Home.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import PatchFeed from "./pages/PatchFeed.jsx";
import Profile from "./pages/Profile.jsx";
import JournalPage from "./pages/JournalFeed.jsx";
import FullPageLoader from "./components/Loader.jsx";

import "./styles/Profile.css";

const SocketWatcher = () => {
  const { userUuid } = useAuthStore();

  useEffect(() => {
    if (userUuid) {
      socket.connect();
      
     
      if (socket.connected) {
        socket.emit("current_Logged_In_User_Uuid", { userUuid });
        console.log("📤 Emitting UUID (immediate):", userUuid);
      }

    
      const onConnect = () => {
        console.log("✅ Socket Connected! ID:", socket.id);
        socket.emit("current_Logged_In_User_Uuid", { userUuid });
      };

      socket.on("connect", onConnect);

      return () => {
        socket.off("connect", onConnect);
      };
    }
  }, [userUuid]);



  useEffect(() => {
    setupSocketListeners(queryClient);
    return () => {
      socket.off("incoming_connect_request");
      socket.off("unConnect_Status_Changes");
      socket.off("connection_updated_for_requested_user");
      socket.off("connection_status_updated_for_accepted_user");
    };
  }, []);

  return null;
};

const AuthenticatedGuard = ({ children }) => {
  const { userUuid } = useAuthStore();
  console.log("AuthGuard:", userUuid);
  useInitializeUser();
  if (userUuid === null) return <FullPageLoader />;
  return userUuid ? children : <Navigate to="/login" />;
};

const PresenceContainer = () => (
  <div className="app-container">
    <div className="presence-notification-slot">
      <Pending_Request />
    </div>
    <div className="main-content-slot">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  return (
    <>
      <SocketWatcher />
      <Router>
        <Routes>
          <Route path="/" element={<AuthHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <AuthenticatedGuard>
                <PresenceContainer />
              </AuthenticatedGuard>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/createtask" element={<CreateTask />} />
            <Route path="/patchfeed/:uuid" element={<PatchFeed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:targetProfileUuid" element={<Profile />} />
            <Route path="/pending-requests" element={<Pending_Request />} />
            <Route
              path="/journalfeed/:targetUserUuid"
              element={<JournalPage />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
