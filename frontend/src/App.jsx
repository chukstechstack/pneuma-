import { queryClient } from "@api/queryClient";
import { useInitializeUser } from "@hooks/useInitializeUser";
import  { setupSocketListeners } from "@services/socketService.js";
import socket from "@api/socketApi.js"
import { useAuthStore } from "@store/useAuthStore";
import  { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import FullPageLoader from "@components/Loader.jsx";
import Pending_Request from "@components/Pending-Requests.jsx";
import CreateTask from "@pages/CreateTask.jsx";
import HomePage from "@pages/Home.jsx";
import JournalPage from "@pages/JournalFeed.jsx";
import AuthHome from "@pages/LandingPage.jsx";
import Login from "@pages/Login.jsx";
import PatchFeed from "@pages/PatchFeed.jsx";
import Profile from "@pages/Profile.jsx";
import Register from "@pages/Register.jsx";


import "@styles/Profile.css";

const SocketWatcher = () => {
  const { userUuid } = useAuthStore();

  useEffect(() => {
    if (!userUuid) return;


    setupSocketListeners(queryClient);

    const onConnect = () => {
      console.log("✅ Socket Connected! ID:", socket.id);
      socket.emit("current_Logged_In_User_Uuid", { userUuid });
      console.log("📤 Emitting UUID:", userUuid);
    };


    socket.on("connect", onConnect);

    if (socket.connected) {
      console.log("⚡ Already connected, emitting UUID directly");
      socket.emit("current_Logged_In_User_Uuid", { userUuid });
            console.log(" User Emmited", {userUuid});
    } else {
      socket.connect();
    }


    return () => {
      socket.off("connect", onConnect);
    };
  }, [userUuid]);

  return null;
};
const AuthenticatedGuard = ({ children }) => {
  const { userUuid } = useAuthStore();
  console.log("AuthGuard:", userUuid);
  useInitializeUser();
  if (userUuid === null) return <FullPageLoader />;
  return userUuid ? children : <Navigate to="/login" />
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
