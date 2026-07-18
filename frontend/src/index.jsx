import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.jsx";
import { queryClient } from './api/queryClient';

// Test helper exposed to browser console
window.testCacheUpdate = () => {
  queryClient.setQueryData(['pendingRequests'], [{ 
    requested_User_Uuid: 'test-123', 
    firstName: 'TEST', 
    lastName: 'USER' 
  }]);
  console.log("Manual update triggered!");
};

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);