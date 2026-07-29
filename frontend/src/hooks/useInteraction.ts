import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
type InteractionPayload = {
  taskUuid: string,
  type: string;
}
export const useInteraction = (queryKeys: string[][] = [["homeFeed"], ["journalFeed"]]) => {
  const queryClient = useQueryClient();

  const updatePaginatedFeed = (oldData: any, updaterFn: any) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      pages: oldData.pages.map((page: any) => ({
        ...page,
        tasks: page.tasks.map(updaterFn),
      })),
    };
  };

  return useMutation({
    mutationFn: ({ taskUuid, type }: InteractionPayload) => 
      api.post(`/task/interaction/${taskUuid}`, { type }),

    onMutate: async ({ taskUuid, type }) => {
    
      for (const key of queryKeys) {
        await queryClient.cancelQueries({ queryKey: key });
      }

      const previousDataMap = new Map();
      for (const key of queryKeys) {
        previousDataMap.set(key.join(), queryClient.getQueryData(key));
      }

      const optimisticUpdater = (t: any) => {
        if (t.uuid !== taskUuid) return t;
        const field = type === "like" ? "is_liked" : "is_reposted";
        const count = type === "like" ? "likes_count" : "reposts_count";
        return {
          ...t,
          [field]: !t[field],
          [count]: t[field] ? Math.max(0, (t[count] || 0) - 1) : (t[count] || 0) + 1,
        };
      };

      // Update all specified query caches optimistically
      for (const key of queryKeys) {
        queryClient.setQueryData(key, (old: any) => updatePaginatedFeed(old, optimisticUpdater));
      }

      return { previousDataMap };
    },

    onSuccess: (data, variables, context) => {
      const updatedPost = data?.data?.updatedPost;
      if (updatedPost) {
        const serverUpdater = (t: any) => (t.uuid === updatedPost.uuid ? { ...t, ...updatedPost } : t);
        for (const key of queryKeys) {
          queryClient.setQueryData(key, (old: any) => updatePaginatedFeed(old, serverUpdater));
        }
      }
    },

    onError: (err, variables, context) => {
      if (context?.previousDataMap) {
        for (const key of queryKeys) {
          const prevData = context.previousDataMap.get(key.join());
          if (prevData !== undefined) {
            queryClient.setQueryData(key, prevData);
          }
        }
      }
      alert("Interaction failed. Please try again.");
    },
  });
};