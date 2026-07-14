import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupSocketListeners } from "./services/socketService";
import App from "./App.jsx";

const queryClient = new QueryClient();

setupSocketListeners(queryClient);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);