import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../src/api/axios"

export interface ConnectionAlert {
  id: number | string;
  type: string;
  is_read: boolean;
  created_at: string;
  reference_id: number | string;
  actor_uuid: string;
  actor_name: string;
  actor_avatar_url: string | null;
  post_snippet: string | null;
}

export const useAlerts = () => {
  const queryClient = useQueryClient();

  // Fetch alerts query
  const { data, isLoading } = useQuery({
    queryKey: ["user-alerts"],
    queryFn: async () => {
      const response = await api.get("/task/alerts");
      return response.data as { success: boolean; alerts: ConnectionAlert[]; hasUnread: boolean };
    },
    refetchInterval: 60000, // Optional: auto-poll every 60s
  });

  // Mark alert as read mutation
  const { mutate: markAsRead } = useMutation({
    mutationFn: async (alertId: number | string) => {
      await api.patch(`/task/alerts/${alertId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-alerts"] });
    },
  });

  return {
    alerts: data?.alerts || [],
    hasUnread: data?.hasUnread || false,
    isLoading,
    markAsRead,
  };
};