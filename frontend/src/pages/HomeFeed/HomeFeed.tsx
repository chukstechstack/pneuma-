import React from "react";
import Task from "@components/Task/Task";
import NavBar from "@/pages/NavBar/NavBar";
import FullPageLoader from "@components/Loader";
import { TaskItem } from "@shared/types";
import { useHomeFeed } from "@pages/HomeFeed/useHomeFeed";

type NavBarProps = { currentUserUuid: string | null };
const NavBarTyped = NavBar as React.ComponentType<NavBarProps>;

const HomeFeed: React.FC = () => {
  const {
    tasks,
    userUuid,
    isLoading,
    isFetchingNextPage,
    ref,
    isOwner,
    deleteSelectedTask,
    handle_Like_Reply_Share_Interaction,
    navigate,
  } = useHomeFeed();

  if (isLoading && tasks.length === 0) return <FullPageLoader />;

  return (
    <div className="pneuma-app-shell">
      <NavBarTyped currentUserUuid={userUuid} />
      
      <div className="pneuma-main-stage">
        <main className="pneuma-central-feed">
          <div className="pneuma-stream-wrapper">
            {tasks.map((task: TaskItem) => (
              <Task
                key={task.uuid || task.id}
                task={task}
                currentUserUuid={userUuid}
                isOwner={isOwner(task)}
                onDelete={() => deleteSelectedTask(task.uuid)}
                onEdit={(uuid) => navigate(`/patchfeed/${uuid}`)}
                onInteraction={handle_Like_Reply_Share_Interaction}
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

export default HomeFeed;