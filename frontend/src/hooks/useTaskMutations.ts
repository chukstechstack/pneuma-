import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios.js";

export const useDeleteTask = (queryKey) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (uuid) => api.delete(`/task/${uuid}`),

        onMutate: async (uuid) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        tasks: page.tasks.filter((task) => task.uuid !== uuid),
                    })),
                };
            });
            return { previousData };
        },
        onError: (err, uuid, context) => {
            queryClient.setQueryData(queryKey, context.previousData);
        },
        onSuccess: (response) => {
            console.log("Delete successful! Server response:", response);

        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};


export const useUpdateTask = (targetUserUuid) => {
    const queryClient = useQueryClient();
    const homeKey = ["homeFeed"];
    const journalKey = ["journal", targetUserUuid];

    return useMutation({
        mutationFn: ({ uuid, formData }) => api.patch(`/task/${uuid}`, formData),

        onMutate: async ({ uuid, content }) => {
            await queryClient.cancelQueries({ queryKey: homeKey });
            await queryClient.cancelQueries({ queryKey: journalKey });

            const prevHome = queryClient.getQueryData(homeKey);
            const prevJournal = queryClient.getQueryData(journalKey);


            const updateTaskInPages = (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        tasks: page.tasks.map((t) => t.uuid === uuid ? { ...t, content } : t),
                    })),
                };
            };

            queryClient.setQueryData(homeKey, updateTaskInPages);
            queryClient.setQueryData(journalKey, updateTaskInPages);

            return { prevHome, prevJournal };
        },

        onSuccess: (response) => {
            console.log("Update successful! Server response:", response);
            console.log("Updated data:", response.data);
        },
        onSettled: (data) => {
            if (data?.data?.updatedTask) {
                const updatedTask = data.data.updatedTask;
                const updateWithServerData = (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            tasks: page.tasks.map((t) => t.uuid === updatedTask.uuid ? updatedTask : t),
                        })),
                    };
                };
                queryClient.setQueryData(homeKey, updateWithServerData);
                queryClient.setQueryData(journalKey, updateWithServerData);
            }
        },

        onError: (err, variables, context) => {
            queryClient.setQueryData(homeKey, context.prevHome);
            queryClient.setQueryData(journalKey, context.prevJournal);
            alert("Failed to update task.");
        },
    });
};