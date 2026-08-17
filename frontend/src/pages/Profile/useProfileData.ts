import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios.js";
import { useConnectionMutation } from "@hooks/useConnections.js";
import { useAuthStore } from "@store/useAuthStore.js";
import { InnerCircleUser, ProfileQueryData, FetchConversationResponse } from "./Profile.types";

export const useProfileData = () => {
  const { targetProfileUuid } = useParams<{ targetProfileUuid?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const authState = useAuthStore();
  const user = (authState as any).user;
  const currentUserUuid = user?.uuid;
  const uuid = targetProfileUuid || "me";

  const [isDockOpen, setIsDockOpen] = useState(false);

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

  const { data: innerCircle = [], isLoading: dockLoading } = useQuery<InnerCircleUser[]>({
    queryKey: ["innerCircle", uuid],
    queryFn: async () => {
      const res = await api.get(`/task/profile/innerCircle-details/${uuid}`);
      return res.data.list || [];
    },
    enabled: isDockOpen,
    initialData: () => queryClient.getQueryData(["innerCircle", uuid]),
    refetchOnWindowFocus: false,
  });

  const { mutate: toggleConnection } = useConnectionMutation(uuid);

  const handleMessageInitialization = async (profileId: string | number): Promise<void> => {
    try {
      const res = (await api.post("/task/fetchConversation", {
        targetUserProfileId: profileId,
      })) as FetchConversationResponse;
      navigate(`/messages/${res.data.conversationId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Room initialization failed:", message);
    }
  };

  return {
    uuid,
    currentUserUuid,
    isDockOpen,
    setIsDockOpen,
    data,
    isLoading,
    isError,
    innerCircle,
    dockLoading,
    toggleConnection,
    handleMessageInitialization,
    navigate,
  };
};