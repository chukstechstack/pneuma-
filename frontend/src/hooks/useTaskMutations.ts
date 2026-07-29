
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

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
    previousData: QueryData | undefined;
}

interface UpdateTaskParams {
    uuid: string;
    formData?: any;
    content?: string;
}

interface UpdateContext {
    prevHome: QueryData | undefined;
    prevJournal: QueryData | undefined;
}

interface UpdateResponse {
    data: {
        updatedTask: Task;
    };
}

export const useDeleteTask = (queryKey: string[]) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (uuid: string) => api.delete(`/task/${uuid}`),

        onMutate: async (uuid: string) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData<QueryData>(queryKey);

            queryClient.setQueryData(queryKey, (old: QueryData | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: Page) => ({
                        ...page,
                        tasks: page.tasks.map((task: Task) => task).filter((task: Task) => task.uuid !== uuid),
                    })),
                };
            });
            return { previousData };
        },
        onError: (err: any, uuid: string, context: DeleteContext | undefined) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
        },
        onSuccess: (response: any) => {
            console.log("Delete successful! Server response:", response);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};


export interface UseUpdateTaskOptions {
    targetUserUuid: string;
}

export const useUpdateTask = (targetUserUuid: string) => {
    const queryClient = useQueryClient();
    const homeKey: string[] = ["homeFeed"];
    const journalKey: (string | undefined)[] = ["journal", targetUserUuid];

    return useMutation<UpdateResponse, any, UpdateTaskParams, UpdateContext>({
        mutationFn: ({ uuid, formData }: UpdateTaskParams) => api.patch(`/task/${uuid}`, formData),

        onMutate: async ({ uuid, content }: UpdateTaskParams): Promise<UpdateContext> => {
            await queryClient.cancelQueries({ queryKey: homeKey });
            await queryClient.cancelQueries({ queryKey: journalKey });

            const prevHome = queryClient.getQueryData<QueryData>(homeKey);
            const prevJournal = queryClient.getQueryData<QueryData>(journalKey as unknown as string[]);


            const updateTaskInPages = (old: QueryData | undefined): QueryData | undefined => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: Page) => ({
                        ...page,
                        tasks: page.tasks.map((t: Task) => t.uuid === uuid ? { ...t, content } : t),
                    })),
                };
            };

            queryClient.setQueryData<QueryData>(homeKey, updateTaskInPages);
            queryClient.setQueryData<QueryData>(journalKey as unknown as string[], updateTaskInPages);

            return { prevHome, prevJournal };
        },

        onSuccess: (response: UpdateResponse) => {
            console.log("Update successful! Server response:", response);
            console.log("Updated data:", response.data);
        },
        onSettled: (data?: UpdateResponse) => {
            if (data?.data?.updatedTask) {
                const updatedTask: Task = data.data.updatedTask;
                const updateWithServerData = (old: QueryData | undefined): QueryData | undefined => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: Page) => ({
                            ...page,
                            tasks: page.tasks.map((t: Task) => t.uuid === updatedTask.uuid ? updatedTask : t),
                        })),
                    };
                };
                queryClient.setQueryData<QueryData>(homeKey, updateWithServerData);
                queryClient.setQueryData<QueryData>(journalKey as unknown as string[], updateWithServerData);
            }
        },

        onError: (err: any, variables: UpdateTaskParams, context?: UpdateContext) => {
            queryClient.setQueryData<QueryData>(homeKey, context?.prevHome);
            queryClient.setQueryData<QueryData>(journalKey as unknown as string[], context?.prevJournal);
            alert("Failed to update task.");
        },
    });
};