import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

// ─── Types ───────────────────────────────────────────

interface Task {
    uuid: string;
    content?: string;
    [key: string]: any;
}

interface Page {
    tasks: Task[];
    [key: string]: any;
}

interface QueryData {
    pages: Page[];
    [key: string]: any;
}

interface DeleteContext {
    prevHome: QueryData | undefined;
    prevJournal: QueryData | undefined;
}

interface UpdateContext {
    prevHome: QueryData | undefined;
    prevJournal: QueryData | undefined;
    prevProfile: QueryData | undefined;
}

interface UpdateTaskParams {
    uuid: string;
    formData?: any;
    content?: string;
    previewUrl?: string;
}

interface UpdateResponse {
    data: {
        updatedTask: Task;
    };
}

export interface UseUpdateTaskOptions {
    targetUserUuid: string;
}

// ─── Delete Task ─────────────────────────────────────

export const useDeleteTask = (targetUserUuid: string) => {
    const queryClient = useQueryClient();
    const homeKey: string[] = ["homeFeed"];
    const journalKey: (string | undefined)[] = ["journalFeed", targetUserUuid];

    return useMutation<any, any, string, DeleteContext>({
        mutationFn: (uuid: string) => api.delete(`/task/${uuid}`),

        onMutate: async (uuid: string): Promise<DeleteContext> => {
            await queryClient.cancelQueries({ queryKey: homeKey });
            await queryClient.cancelQueries({ queryKey: journalKey });

            const prevHome = queryClient.getQueryData<QueryData>(homeKey);
            const prevJournal = queryClient.getQueryData<QueryData>(journalKey as unknown as string[]);

            const removeTaskFromPages = (old: QueryData | undefined): QueryData | undefined => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: Page) => ({
                        ...page,
                        tasks: page.tasks.filter((t: Task) => t.uuid !== uuid),
                    })),
                };
            };

            queryClient.setQueryData(homeKey, removeTaskFromPages);
            queryClient.setQueryData(journalKey as unknown as string[], removeTaskFromPages);

            return { prevHome, prevJournal };
        },

        onError: (err: any, uuid: string, context: DeleteContext | undefined) => {
            if (context?.prevHome) {
                queryClient.setQueryData(homeKey, context.prevHome);
            }
            if (context?.prevJournal) {
                queryClient.setQueryData(journalKey as unknown as string[], context.prevJournal);
            }
        },

        onSuccess: (response: any) => {
            console.log("Delete successful! Server response:", response);
        },
    });
};

// ─── Update Task ─────────────────────────────────────

export const useUpdateTask = (targetUserUuid: string) => {
    const queryClient = useQueryClient();
    
    const homeKey: string[] = ["homeFeed"];
    const journalKey: (string | undefined)[] = ["journalFeed", targetUserUuid];
    const profileKey: (string | null)[] = ["profileFeed", targetUserUuid]

    return useMutation<UpdateResponse, any, UpdateTaskParams, UpdateContext>({
        mutationFn: ({ uuid, formData }: UpdateTaskParams) => api.patch(`/task/${uuid}`, formData),

        onMutate: async ({ uuid, content, previewUrl }: UpdateTaskParams): Promise<UpdateContext> => {
            await queryClient.cancelQueries({ queryKey: homeKey });
            await queryClient.cancelQueries({ queryKey: journalKey });
            await queryClient.cancelQueries({ queryKey: profileKey });


            const prevHome = queryClient.getQueryData<QueryData>(homeKey);
            const prevJournal = queryClient.getQueryData<QueryData>(journalKey as unknown as string[]);
            const prevProfile = queryClient.getQueryData<QueryData>(profileKey as unknown as string[]);

            const updateTaskInPages = (old: QueryData | undefined): QueryData | undefined => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: Page) => ({
                        ...page,
                        tasks: page.tasks.map((task: Task) =>
                            task.uuid === uuid
                                ? { ...task, content, ...(previewUrl ? { img: previewUrl } : {}) }
                                : task
                        ),
                    })),
                };
            };

            queryClient.setQueryData<QueryData>(homeKey, updateTaskInPages);
            queryClient.setQueryData<QueryData>(journalKey as unknown as string[], updateTaskInPages);
            queryClient.setQueryData<QueryData>(profileKey as unknown as string[], updateTaskInPages);

            return { prevHome, prevJournal, prevProfile };
        },

        onSuccess: (response: UpdateResponse) => {
            console.log("Update successful! Server response:", response);

            const responsePayload = response?.data || response;

            if (responsePayload?.updatedTask) {
                const updatedTask: Task = responsePayload.updatedTask;

                const updateWithServerData = (old: QueryData | undefined): QueryData | undefined => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: Page) => ({
                            ...page,
                            tasks: page.tasks.map((t: Task) => (t.uuid === updatedTask.uuid ? updatedTask : t)),
                        })),
                    };
                };

                queryClient.setQueryData<QueryData>(homeKey, updateWithServerData);
                queryClient.setQueryData<QueryData>(journalKey as unknown as string[], updateWithServerData);
                queryClient.setQueryData<QueryData>(profileKey as unknown as string[], updateWithServerData);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: homeKey, refetchType: "none" });
            queryClient.invalidateQueries({ queryKey: journalKey, refetchType: "none" });
            queryClient.invalidateQueries({ queryKey: profileKey, refetchType: "none" });
        },
        onError: (err: any, variables: UpdateTaskParams, context?: UpdateContext) => {
            queryClient.setQueryData<QueryData>(homeKey, context?.prevHome);
            queryClient.setQueryData<QueryData>(journalKey as unknown as string[], context?.prevJournal);
            queryClient.setQueryData<QueryData>(profileKey as unknown as string[], context?.prevProfile);
            alert("Failed to update task.");
        },
    });
};