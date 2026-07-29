import React, { useEffect } from "react";
import { useParams, useNavigate, useParams as useParamsType } from "react-router-dom";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import api from "@/api/axios.js";
import Task from "@components/HomeTaskInput.jsx";
import NavBar from "@/pages/NavBar/NavBar";
import FullPageLoader from "@components/Loader.jsx";
import { useAuthStore } from "@store/useAuthStore";
import { useDeleteTask } from "@hooks/useTaskMutations";

interface JournalTask extends Record<string, any> {
  uuid: string;
  author_profile_uuid?: string | null;
}

interface JournalFeedPage {
  tasks: JournalTask[];
  next_post_timestamp?: string;
}

interface JournalPageParams extends Record<string, string | undefined> {
  targetUserUuid?: string;
}

interface AuthStore {
  userUuid: string | null | undefined;
}

interface TaskProps {
  key: string;
  task: JournalTask;
  isOwner: boolean;
  deleteTask: () => void;
  onEdit: (uuid: string) => void;
  handle_Like_Reply_Share_Interaction: () => void;
  currentUserUuid: string | null | undefined;
}

interface UseInfiniteQueryParams {
  pageParam?: unknown;
}

const JournalPage = (): React.ReactElement => {
  const { targetUserUuid } = useParams<JournalPageParams>();
  const { userUuid }: AuthStore = useAuthStore();
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
      queryFn: async ({ pageParam = "Yes_Is_FreshLoad" }: UseInfiniteQueryParams) => {
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
  const TaskTyped = Task as React.ComponentType<TaskProps>;
  const journalTasks: JournalTask[] = data?.pages.flatMap((page) => page.tasks) || [];

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="home-layout">
      <NavBar />
      <div className="dashboard-grid">
        <main
          className="timeline-feed-wrapper"
          style={{ gridColumn: "span 2" }}
        >
          <div className="journal-header-banner">
 
          </div>

          <div className="timeline-posts-container">
            {journalTasks.length === 0 ? (
              <div className="empty-journal-message">
                No testimonies saved yet.
              </div>
            ) : (
              journalTasks.map((task) => (
                <TaskTyped
                  key={task.uuid}
                  task={{ ...task, author_profile_uuid: task.author_profile_uuid ?? "" }}
                  isOwner={isOwner}
                  deleteTask={() => deleteSelectedTask(task.uuid)}
                  onEdit={(uuid: string) => navigate(`/patchfeed/${uuid}`)}
                  handle_Like_Reply_Share_Interaction={() => {}}
                  currentUserUuid={userUuid ?? ""}
                />
              ))
            )}

            <div ref={ref} style={{ height: "20px" }}>
              {isFetchingNextPage && <p>Loading more...</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JournalPage;
