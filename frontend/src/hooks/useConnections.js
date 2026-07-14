import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export const useConnectionMutation = (targetUuid) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await api.post(`/task/profile/connect/${targetUuid}`);
            return res.data;
        },
        onMutate: async (action) => {
            await queryClient.cancelQueries({ queryKey: ['connectionStatus', targetUuid] });
            const previous = queryClient.getQueryData(['connectionStatus', targetUuid]);


            const nextState = action === 'connect' ? 'pending' : 'none';
            queryClient.setQueryData(['connectionStatus', targetUuid], nextState);

            return { previous };
        },
        onSuccess: (data) => {

            const newStatus = data.status || data;
            queryClient.setQueryData(['connectionStatus', targetUuid], newStatus);
        },
        onError: (err, action, context) => {
            queryClient.setQueryData(['connectionStatus', targetUuid], context.previous);
        },

    });
};