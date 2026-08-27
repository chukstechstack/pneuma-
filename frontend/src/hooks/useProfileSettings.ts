import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/api/axios";
import socket from "@/api/socketApi";

// 1. Hook to fetch profile settings
export const useProfileSettings = (isOpen: boolean) => {
  return useQuery({
    queryKey: ["profileSettings"],
    queryFn: async () => {
      const res = await api.get("/task/profile/settings");
      return res.data.settings;
    },
    enabled: isOpen,
    staleTime: 0
  });
};

// 2. Hook to update profile details
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedData: {
      full_name?: string;
      email?: string;
      bio?: string;
      password?: string;
    }) => {
      const res = await api.put("/task/profile/update", updatedData);
      return res.data;
    },
    onSuccess: (data) => {
      const updatedProfile = data.profile;
      // Immediately update local cache on mutation success using the real database return
      if (updatedProfile?.uuid) {
        queryClient.setQueryData(["taskProfile", updatedProfile.uuid], updatedProfile);
      }
      queryClient.invalidateQueries({ queryKey: ["profileSettings"] });
      queryClient.invalidateQueries({ queryKey: ["profileFeed"] });
    },
  });
};

// 3. Standalone Socket Listener Hook for Profile Updates
export const useProfileSocketListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Standalone socket listener: grabs backend data when emitted
    const handleServerProfileUpdate = (data: { userUuid: string; profile: any }) => {
      if (!data?.userUuid) return;

      // Option A: Set data directly using the real database result from the socket
      if (data.profile) {
        queryClient.setQueryData(["taskProfile", data.userUuid], data.profile);
      }

      // Option B: Or quickly invalidate the query to ensure fresh sync across all task cards
      queryClient.invalidateQueries({ queryKey: ["taskProfile", data.userUuid] });
    };

    socket.on("server:profile_updated", handleServerProfileUpdate);

    return () => {
      socket.off("server:profile_updated", handleServerProfileUpdate);
    };
  }, [queryClient]);
};

// 4. Standard Hook to fetch task profile data
export const useTaskProfile = (userUuid: string) => {
  return useQuery({
    queryKey: ["taskProfile", userUuid],
    queryFn: async () => {
      if (!userUuid) return null;
      const res = await api.get(`/task/profile/task-profile/${userUuid}`);
      return res.data.profile;
    },
    enabled: !!userUuid,
  });
};