import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore.js";
import { ProfileQueryData } from "./Profile.types";

export const useProfileData = () => {
  const { targetProfileUuid } = useParams<{ targetProfileUuid?: string }>();
  const navigate = useNavigate();

  const authState = useAuthStore();
  const user = (authState as any).user;
  const currentUserUuid = user?.uuid;

  const uuid = targetProfileUuid || "me";

  // 🪄 Modal / Dock States
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [isMessageDockOpen, setIsMessageDockOpen] = useState(false); // <--- New Inbox Dock state

  // 📝 Fetches public profile information and journal posts
  const { data, isLoading, isError } = useQuery<ProfileQueryData>({
    queryKey: ["profileFeed", uuid],
    queryFn: async () => {
      const endpoint = targetProfileUuid ? `/task/profile/${targetProfileUuid}` : `/task/profile/me`;
      const res = await api.get(endpoint);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    uuid,
    currentUserUuid,
    isDockOpen,
    setIsDockOpen,
    isMessageDockOpen,          // <--- Exported for the inbox popup
    setIsMessageDockOpen,       // <--- Exported for the inbox popup
    data,
    isLoading,
    isError,
    navigate,
  };
};