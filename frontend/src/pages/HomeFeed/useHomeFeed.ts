import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore";
import { useDeleteTask } from "@hooks/useTaskMutations";
import { useInteraction } from "@hooks/useInteraction";
import { TaskItem } from "@shared/types";
import { HomeFeedResponse } from "@pages/HomeFeed/Feed.Types";

export const useHomeFeed = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const { userUuid } = useAuthStore() as { userUuid: string | null };

  const { mutate: deleteSelectedTask } = useDeleteTask(["homeFeed"]);
  const { mutate: interact } = useInteraction([["homeFeed"]]);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<HomeFeedResponse>({
      queryKey: ["homeFeed"],
      queryFn: async ({ pageParam = "Yes_Is_FreshLoad" }) => {
        const currentFreezeTime = Date.now();
    console.log(" 🔍 Attempting to Fetching HomeFeed with freeze_time:", currentFreezeTime);
     const res = await api.get(`/task?freeze_time=${currentFreezeTime}&fresh_load=${pageParam}`);
        console.log("🔄 HomeFeed Fetched", res);
        return res.data;
      },
      getNextPageParam: (lastPage: any) => lastPage.next_post_timestamp || undefined,
      initialPageParam: "Yes_Is_FreshLoad",
      refetchOnWindowFocus: false,
    });

  const tasks: TaskItem[] = data?.pages.flatMap((page) => page.tasks) || [];

  const isOwner = (task: TaskItem): boolean => userUuid === task.author_profile_uuid;

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handle_Like_Reply_Share_Interaction = (taskUuid: string, type: string): void => {
    interact({ taskUuid, type });
  };

  return {
    tasks,
    userUuid,
    isLoading,
    isFetchingNextPage,
    ref,
    isOwner,
    deleteSelectedTask,
    handle_Like_Reply_Share_Interaction,
    navigate,
  };
};