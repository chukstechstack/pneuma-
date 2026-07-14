import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import socket, { setupSocketListeners } from "./services/socketservice.js";
import { useInitializeUser } from "./hooks/useInitializeUser";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Pending_Request from "./components/pending-Requests.jsx";
import AuthHome from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import HomePage from "./pages/Home.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import PatchFeed from "./pages/PatchFeed.jsx";
import Profile from "./pages/Profile.jsx";
import JournalPage from "./pages/JournalFeed.jsx";
import { useAuthStore } from "./store/useAuthStore";

const queryClient = new QueryClient();

const SocketWatcher = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setupSocketListeners(queryClient);

    return () => {
      socket.off("incoming_connect_request");
      socket.off("unConnect_Status_Changes");
      socket.off("connection_updated_for_requested_user");
      socket.off("connection_status_updated_for_accepted_user");
    };
  }, [queryClient]);

  return null;
};

const App = () => {
  useInitializeUser();

  return (
    <QueryClientProvider client={queryClient}>
      <SocketWatcher />
      <Pending_Request />
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

          <Route
            path="/journalfeed/:targetUserUuid"
            element={<JournalPage />}
          />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
