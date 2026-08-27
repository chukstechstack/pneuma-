import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore";
import { useDeleteTask } from "@hooks/useTaskMutations";
import { TaskItem } from "@shared/types";
import { HomeFeedResponse } from "@pages/HomeFeed/Feed.Types";
import { usePostEditSocket } from "../../PatchFeed/SocketPatch";

export const useHomeFeed = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const { userUuid } = useAuthStore() as { userUuid: string | null };

  const { mutate: deleteSelectedTask } = useDeleteTask(userUuid ?? '');
  usePostEditSocket();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<HomeFeedResponse>({
      queryKey: ["homeFeed"],
      queryFn: async ({ pageParam = "Yes_Is_FreshLoad" }) => {
        const res = await api.get(`/task?fresh_load=${pageParam}`);
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

  return {
    tasks,
    userUuid,
    isLoading,
    isFetchingNextPage,
    ref,
    isOwner,
    deleteSelectedTask,
    navigate,
  };
};