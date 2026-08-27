import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "@/api/socketApi";

export const NewPostsBanner: React.FC = () => {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();

  // 🔌 Listen for new post broadcasts directly inside the banner component
  useEffect(() => {
    const handleNewPostAvailable = (eventData: any) => {
      console.log("🔔 [NewPostsBanner] Caught live post broadcast:", eventData);
      setShow(true);
    };

    socket.on("server:new_post_available", handleNewPostAvailable);

    return () => {
      socket.off("server:new_post_available", handleNewPostAvailable);
    };
  }, []);

  const handleRefresh = async () => {
    console.log("🖱️ [NewPostsBanner] Clicked! Resetting home feed cache...");
    setShow(false);
    await queryClient.resetQueries({ queryKey: ["homeFeed"] });
  };

  console.log("🔍 NewPostsBanner render state -> show:", show);

  if (!show) return null;

  return (
    <button 
      onClick={handleRefresh}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-all animate-bounce cursor-pointer"
    >
      ✨ New posts available! Click to refresh
    </button>
  );
};