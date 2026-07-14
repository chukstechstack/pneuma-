import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import api from "../api/axios.js";
import Task from "../components/HomeTaskInput.jsx";
import NavBar from "../components/NavBar";
import FullPageLoader from "../components/Loader.jsx";
import { useAuthStore } from "../store/useAuthStore";
import { useDeleteTask } from "../hooks/useTaskMutations"; // Import the shared hook

const JournalPage = () => {
  const { targetUserUuid } = useParams();
  const { userUuid } = useAuthStore();
  const navigate = useNavigate();
  const isOwner = userUuid === targetUserUuid;

  // Use the shared hook with the journal-specific query key
  const { mutate: deleteSelectedTask } = useDeleteTask([
    "journal",
    targetUserUuid,
  ]);

  // Create the "Tripwire" sensor
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["journal", targetUserUuid],
      queryFn: async ({ pageParam = "Yes_Is_FreshLoad" }) => {
        console.log(" 🔍 Attempting to Fetching Journal Feed");
        const res = await api.get(
          `/task/journalfeed/${targetUserUuid}?fresh_load=${pageParam}`,
        );
        console.log("🔄 Journal Feed Fetched", res);
        return res.data;
      },
      getNextPageParam: (lastPage) => lastPage.next_post_timestamp || undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const journalTasks = data?.pages.flatMap((page) => page.tasks) || [];

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
            {/* ... header code ... */}
          </div>

          <div className="timeline-posts-container">
            {journalTasks.length === 0 ? (
              <div className="empty-journal-message">
                No testimonies saved yet.
              </div>
            ) : (
              journalTasks.map((task) => (
                <Task
                  key={task.uuid}
                  task={task}
                  isOwner={isOwner}
                  deleteTask={() => deleteSelectedTask(task.uuid)}
                  onEdit={(uuid) => navigate(`/patchfeed/${uuid}`)}
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
