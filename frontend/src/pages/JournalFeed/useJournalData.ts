import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore";
import { useDeleteTask } from "@hooks/useTaskMutations";
import { JournalFeedPage, JournalPageParams, JournalTask } from "./Page.types";

export const useJournalData = () => {
  const { targetUserUuid } = useParams<JournalPageParams>();
  const userUuid = (useAuthStore() as any).userUuid;
  const navigate = useNavigate();
  const isOwner: boolean = userUuid === targetUserUuid;

  const { mutate: deleteSelectedTask } = useDeleteTask([
    "journal",
    targetUserUuid as string,
  ]);

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<JournalFeedPage, Error, InfiniteData<JournalFeedPage>, [string, string | undefined]>({
      queryKey: ["journal", targetUserUuid],
      queryFn: async ({ pageParam = "Yes_Is_FreshLoad" }: { pageParam?: unknown }) => {
        console.log(" 🔍 Attempting to Fetching Journal Feed");
        const res = await api.get<JournalFeedPage>(
          `/task/journalfeed/${targetUserUuid}?fresh_load=${pageParam}`,
        );
        console.log(" ✔️💥 Fecthed Journal data:", res);
        return res.data;
      },
      initialPageParam: "Yes_Is_FreshLoad",
      getNextPageParam: (lastPage) => lastPage.next_post_timestamp || undefined,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

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
  };
};