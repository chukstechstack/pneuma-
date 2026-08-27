import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";

interface Task {
  uuid: string;
  content?: string;
  img?: string;
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

interface CreateContext {
  tempUuid: string;
  prevHome: QueryData | undefined;
  prevJournal: QueryData | undefined;
  prevProfile: QueryData | undefined;
}

export const useCreateTaskMutation = (userUuid: string | null, previewUrl: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const homeKey: string[] = ["homeFeed"];
  const journalKey: (string | null)[] = ["journalFeed", userUuid];
  const profileKey: (string | null)[] = ["profileFeed", userUuid];
  const alertsKey: string[] = ["user-alerts"];

  return useMutation<any, any, FormData, CreateContext>({
    mutationFn: (data: FormData) => api.post("/task", data),

    onMutate: async (data: FormData): Promise<CreateContext> => {
      await queryClient.cancelQueries({ queryKey: homeKey });
      await queryClient.cancelQueries({ queryKey: journalKey });
      await queryClient.cancelQueries({ queryKey: profileKey });

      const prevHome = queryClient.getQueryData<QueryData>(homeKey);
      const prevJournal = queryClient.getQueryData<QueryData>(journalKey as unknown as string[]);
      const prevProfile = queryClient.getQueryData<QueryData>(profileKey as unknown as string[]);
      
      const tempUuid = `temp-${Date.now()}`;

      const optimisticTask: Task = {
        uuid: tempUuid,
        content: (data.get("content") as string) || "",
        img: previewUrl || undefined,
        author_profile_uuid: userUuid,
        created_at: new Date().toISOString(),
        isPendingUpload: true,
      };

      const prependTask = (old: QueryData | undefined): QueryData | undefined => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: Page, index: number) =>
            index === 0
              ? { ...page, tasks: [optimisticTask, ...page.tasks] }
              : page
          ),
        };
      };

      queryClient.setQueryData<QueryData>(homeKey, prependTask);
      queryClient.setQueryData<QueryData>(journalKey as unknown as string[], prependTask);
      queryClient.setQueryData<QueryData>(profileKey as unknown as string[], prependTask);
      return { tempUuid, prevHome, prevJournal, prevProfile };
    },

    onSuccess: (response: any, _variables, context) => {
      const responsePayload = response?.data || response;
      const createdTask: Task | undefined = responsePayload?.newTask || responsePayload?.task || responsePayload?.createdTask;

      if (createdTask && context?.tempUuid) {
        const swapTempForReal = (old: QueryData | undefined): QueryData | undefined => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: Page) => ({
              ...page,
              tasks: page.tasks.map((t: Task) => (t.uuid === context.tempUuid ? createdTask : t)),
            })),
          };
        };

        queryClient.setQueryData<QueryData>(homeKey, swapTempForReal);
        queryClient.setQueryData<QueryData>(journalKey as unknown as string[], swapTempForReal);
        queryClient.setQueryData<QueryData>(profileKey as unknown as string[], swapTempForReal);
      }

      // 🚀 Invalidate user alerts so your drop-down refreshes connection activities
      queryClient.invalidateQueries({ queryKey: alertsKey });

      navigate("/homefeed");
    },

    onError: (_err, _variables, context) => {
      if (context?.prevHome) {
        queryClient.setQueryData(homeKey, context.prevHome);
      }
      if (context?.prevJournal) {
        queryClient.setQueryData(journalKey as unknown as string[], context.prevJournal);
      }
      if (context?.prevProfile) {
        // Fixed: was incorrectly pointing back to journalKey instead of profileKey
        queryClient.setQueryData(profileKey as unknown as string[], context.prevProfile);
      }
      alert("Failed to create task.");
    },
  });
};