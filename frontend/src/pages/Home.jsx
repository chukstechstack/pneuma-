import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import api from "@api/axios.js";
import Task from "@components/HomeTaskInput.jsx";
import NavBar from "@components/NavBar";
import FullPageLoader from "@components/Loader.jsx";
import "@styles/HomeFeed.css";
import { useAuthStore } from "@store/useAuthStore";
import { useDeleteTask } from "@hooks/useTaskMutations";
import { useInteraction } from "@hooks/useInteraction";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
  const { ref, inView } = useInView();
  const { userUuid } = useAuthStore();
  const navigate = useNavigate();

  const { mutate: deleteSelectedTask } = useDeleteTask(["homeFeed"]);
  const { mutate: interact } = useInteraction(["homeFeed"]);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["homeFeed"],
      queryFn: async ({ pageParam = "Yes_Is_FreshLoad" }) => {
        console.log(" 🔍 Attempting to Fetching HomeFeed");
        const res = await api.get(`/task?fresh_load=${pageParam}`);
        console.log("🔄 HomeFeed Fetched", res);
        return res.data;
      },
      getNextPageParam: (lastPage) => lastPage.next_post_timestamp || undefined,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });

  const tasks = data?.pages.flatMap((page) => page.tasks) || [];

  const isOwner = (task) => userUuid === task.author_profile_uuid;

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handle_Like_Reply_Share_Interaction = (taskUuid, type) => {
    interact({ taskUuid, type });
  };

  if (isLoading && tasks.length === 0) return <FullPageLoader />;

  return (
    <div className="pneuma-app-shell">
      <NavBar currentUserUuid={userUuid} />
      <div className="pneuma-main-stage">
        <main className="pneuma-central-feed">
          <div className="pneuma-stream-wrapper">
            {tasks.map((task) => (
              <Task
                key={task.uuid || task.id}
                task={task}
                deleteTask={() => deleteSelectedTask(task.uuid)}
                isOwner={isOwner(task)}
                handle_Like_Reply_Share_Interaction={
                  handle_Like_Reply_Share_Interaction
                }
                currentUserUuid={userUuid}
                onEdit={(uuid) => navigate(`/patchfeed/${uuid}`)}
              />
            ))}

            <div ref={ref} style={{ height: "20px" }}>
              {isFetchingNextPage && (
                <div className="pneuma-pagination-loading-indicator">
                  Reflecting...
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
