import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore";
import { useDeleteTask } from "@hooks/useTaskMutations";
import { JournalFeedPage, JournalPageParams, JournalTask } from "./Page.types";
import { useInteraction } from "@hooks/useInteraction";

export const useJournalData = () => {
  const { targetUserUuid: routeTargetUuid } = useParams<JournalPageParams>();
  const userUuid = (useAuthStore() as any).userUuid;
  const navigate = useNavigate();

  // 👉 Fallback to logged-in user's UUID if the route doesn't specify one or is "sanctuary"
  const targetUserUuid = (!routeTargetUuid || routeTargetUuid === "sanctuary") 
    ? userUuid 
    : routeTargetUuid;

  const isOwner: boolean = userUuid === targetUserUuid;
  const { mutate: interact } = useInteraction([["journalFeed"]]);
  const { mutate: deleteSelectedTask } = useDeleteTask(targetUserUuid ?? "");

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<JournalFeedPage, Error, InfiniteData<JournalFeedPage>, [string, string | undefined]>({
      queryKey: ["journalFeed", targetUserUuid],
      
      // 👉 Enable query once targetUserUuid becomes available (either from route or auth store)
      enabled: Boolean(targetUserUuid),

      queryFn: async ({ pageParam = "Yes_Is_FreshLoad" }: { pageParam?: unknown }) => {
        const res = await api.get<JournalFeedPage>(
          `/task/journalfeed/${targetUserUuid}?fresh_load=${pageParam}`,
        );
        return res.data;
      },
      initialPageParam: "Yes_Is_FreshLoad",
      getNextPageParam: (lastPage) => lastPage.next_post_timestamp || undefined,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handle_Like_Reply_Share_Interaction = (taskUuid: string, type: string): void => {
    interact({ taskUuid, type });
  };

  const journalTasks: JournalTask[] = data?.pages.flatMap((page) => page.tasks) || [];

  return {
    journalTasks,
    isOwner,
    isLoading,
    isFetchingNextPage,
    userUuid,
    ref,
    deleteSelectedTask,
    navigate,
    handle_Like_Reply_Share_Interaction
  };
};