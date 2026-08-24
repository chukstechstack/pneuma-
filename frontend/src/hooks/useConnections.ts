import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// 1. Hook to fetch the list of connections (for the Inner Circle drawer)
export const useConnections = (profileUuid: string) => {
    return useQuery({
        queryKey: ["connections", profileUuid],
        queryFn: async () => {
            if (!profileUuid) return [];
            const response = await axios.get(`/api/profile/${profileUuid}/connections`);
            return response.data.connections || [];
        },
        enabled: !!profileUuid,
    });
};

// 2. Hook to toggle Connect/Disconnect
export const useToggleConnection = (targetProfileUuid: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await axios.post(`/api/profile/${targetProfileUuid}/connect`);
            return response.data;
        },
        onSuccess: () => {
            // 🌟 Invalidate profile feeds
            queryClient.invalidateQueries({ queryKey: ["profileFeed", targetProfileUuid] });
            queryClient.invalidateQueries({ queryKey: ["profileFeed", "me"] });
            queryClient.invalidateQueries({ queryKey: ["homeFeed"] });

            // Refresh the connections list drawer
            queryClient.invalidateQueries({ queryKey: ["connections", targetProfileUuid] });
        },
    });
};