import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import api from "@/api/axios";

interface Task {
    author_profile_uuid: string;
    relation_status: string;
    [key: string]: unknown;
}

interface Page {
    tasks: Task[];
    [key: string]: unknown;
}

interface HomeFeedData {
    pages: Page[];
    [key: string]: unknown;
}

interface ProfileData {
    relationStatus: string;
    [key: string]: unknown;
}

interface JournalFeedData {
    relationStatus: string;
    [key: string]: unknown;
}

interface ConnectionResponse {
    isFollowing: boolean;
    [key: string]: unknown;
}

interface MutateContext {
    previousHomeFeed: HomeFeedData | undefined;
    previousProfile: ProfileData | undefined;
    previousJournal: JournalFeedData | undefined;
}

export const useConnectionMutation = (targetUuid: string): UseMutationResult<ConnectionResponse, Error, void, MutateContext> => {
    const queryClient = useQueryClient();

    return useMutation<ConnectionResponse, Error, void, MutateContext>({
        mutationFn: async () => {
            const res = await api.post(`/task/profile/connect/${targetUuid}`);
            return res.data;
        },
        onMutate: async () => {
            // Cancel all related queries
            await queryClient.cancelQueries({ queryKey: ['homeFeed'] });
            await queryClient.cancelQueries({ queryKey: ['profile', targetUuid] });
            await queryClient.cancelQueries({ queryKey: ['journalFeed', targetUuid] });

            const previousHomeFeed = queryClient.getQueryData<HomeFeedData>(['homeFeed']);
            const previousProfile = queryClient.getQueryData<ProfileData>(['profile', targetUuid]);
            const previousJournal = queryClient.getQueryData<JournalFeedData>(['journalFeed', targetUuid]);


            const newStatus = 'pending';

 
            queryClient.setQueryData<HomeFeedData>(['homeFeed'], (old) => old ? ({
                ...old,
                pages: old.pages.map(p => ({
                    ...p,
                     tasks: p.tasks.map(t =>
                        t.author_profile_uuid === targetUuid ? { ...t, relation_status: newStatus } : t
                    )
                }))
            }) : old);

            queryClient.setQueryData<ProfileData>(['profile', targetUuid], (old) => old ? ({
                ...old,
                relationStatus: newStatus
            }) : old);

            queryClient.setQueryData<JournalFeedData>(['journalFeed', targetUuid], (old) => old ? ({
                ...old,
                relationStatus: newStatus
            }) : old);

            return { previousHomeFeed, previousProfile, previousJournal };
        },
        onSuccess: (data) => {
            const newStatus = data.isFollowing ? 'pending' : 'none';

            queryClient.setQueryData<HomeFeedData>(['homeFeed'], (old) => old ? ({
                ...old,
                pages: old.pages.map(p => ({
                    ...p, tasks: p.tasks.map(t =>
                        t.author_profile_uuid === targetUuid ? { ...t, relation_status: newStatus } : t
                    )
                }))
            }) : old);

            queryClient.setQueryData<ProfileData>(['profile', targetUuid], (old) => old ? ({
                ...old,
                relationStatus: newStatus
            }) : old);

            queryClient.setQueryData<JournalFeedData>(['journalFeed', targetUuid], (old) => old ? ({
                ...old,
                relationStatus: newStatus
            }) : old);
        },
        onError: (err, action, context) => {
            if (context?.previousHomeFeed) queryClient.setQueryData(['homeFeed'], context.previousHomeFeed);
            if (context?.previousProfile) queryClient.setQueryData(['profile', targetUuid], context.previousProfile);
            if (context?.previousJournal) queryClient.setQueryData(['journalFeed', targetUuid], context.previousJournal);
        }
    });
};