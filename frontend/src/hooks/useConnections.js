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
            // Cancel all related queries
            await queryClient.cancelQueries({ queryKey: ['homeFeed'] });
            await queryClient.cancelQueries({ queryKey: ['profile', targetUuid] });
            await queryClient.cancelQueries({ queryKey: ['journalFeed', targetUuid] });

            const previousHomeFeed = queryClient.getQueryData(['homeFeed']);
            const previousProfile = queryClient.getQueryData(['profile', targetUuid]);
            const previousJournal = queryClient.getQueryData(['journalFeed', targetUuid]);

            const newStatus = action === 'connect' ? 'pending' : 'none';

            // Optimistic Updates
            queryClient.setQueryData(['homeFeed'], (old) => old ? ({
                ...old,
                pages: old.pages.map(p => ({
                    ...p, tasks: p.tasks.map(t =>
                        t.author_profile_uuid === targetUuid ? { ...t, relation_status: newStatus } : t
                    )
                }))
            }) : old);

            queryClient.setQueryData(['profile', targetUuid], (old) => old ? ({
                ...old,
                relationStatus: newStatus
            }) : old);

            queryClient.setQueryData(['journalFeed', targetUuid], (old) => old ? ({
                ...old,
                relationStatus: newStatus
            }) : old);

            return { previousHomeFeed, previousProfile, previousJournal };
        },
        onSuccess: (data) => {
            const newStatus = data.isFollowing ? 'pending' : 'none';

            queryClient.setQueryData(['homeFeed'], (old) => old ? ({
                ...old,
                pages: old.pages.map(p => ({
                    ...p, tasks: p.tasks.map(t =>
                        t.author_profile_uuid === targetUuid ? { ...t, relation_status: newStatus } : t
                    )
                }))
            }) : old);

            queryClient.setQueryData(['profile', targetUuid], (old) => old ? ({
                ...old,
                relationStatus: newStatus
            }) : old);

            queryClient.setQueryData(['journalFeed', targetUuid], (old) => old ? ({
                ...old,
                relationStatus: newStatus
            }) : old);
        },
        onError: (err, action, context) => {
            if (context.previousHomeFeed) queryClient.setQueryData(['homeFeed'], context.previousHomeFeed);
            if (context.previousProfile) queryClient.setQueryData(['profile', targetUuid], context.previousProfile);
            if (context.previousJournal) queryClient.setQueryData(['journalFeed', targetUuid], context.previousJournal);
        }
    });
};