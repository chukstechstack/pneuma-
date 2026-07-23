import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@api/axios";

export const useInteraction = () => {
  const queryClient = useQueryClient();


  const updatePaginatedFeed = (oldData, updaterFn) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        tasks: page.tasks.map(updaterFn),
      })),
    };
  };

  return useMutation({
    mutationFn: ({ taskUuid, type }) => api.post(`/task/interaction/${taskUuid}`, { type }),

    onMutate: async ({ taskUuid, type }) => {
      await queryClient.cancelQueries({ queryKey: ["homeFeed"] });
      await queryClient.cancelQueries({ queryKey: ["journalFeed"] });

      const prevHome = queryClient.getQueryData(["homeFeed"]);
      const prevJournal = queryClient.getQueryData(["journalFeed"]);

      const optimisticUpdater = (t) => {
        if (t.uuid !== taskUuid) return t;
        const field = type === "like" ? "is_liked" : "is_reposted";
        const count = type === "like" ? "likes_count" : "reposts_count";
        return {
          ...t,
          [field]: !t[field],
          [count]: t[field] ? Math.max(0, (t[count] || 0) - 1) : (t[count] || 0) + 1,
        };
      };

      queryClient.setQueryData(["homeFeed"], (old) => updatePaginatedFeed(old, optimisticUpdater));
      queryClient.setQueryData(["journalFeed"], (old) => updatePaginatedFeed(old, optimisticUpdater));

      return { prevHome, prevJournal };
    },

    onSuccess: (data) => {

      const updatedPost = data?.data?.updatedPost;
      if (updatedPost) {
        const serverUpdater = (t) => (t.uuid === updatedPost.uuid ? { ...t, ...updatedPost } : t);

        queryClient.setQueryData(["homeFeed"], (old) => updatePaginatedFeed(old, serverUpdater));
        queryClient.setQueryData(["journalFeed"], (old) => updatePaginatedFeed(old, serverUpdater));
      }
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(["homeFeed"], context.prevHome);
      queryClient.setQueryData(["journalFeed"], context.prevJournal);
      alert("Interaction failed. Please try again.");
    },
  });
};