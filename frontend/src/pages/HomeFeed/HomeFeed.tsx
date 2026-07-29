import React from "react";
import Task from "@components/Task/Task";
import NavBar from "@/pages/NavBar/NavBar";
import FullPageLoader from "@components/Loader";
import { TaskItem } from "@shared/types";
import { useHomeFeed } from "@pages/HomeFeed/useHomeFeed";
import "@styles/HomeFeed.css";

type NavBarProps = { currentUserUuid: string | null };
const NavBarTyped = NavBar as React.ComponentType<NavBarProps>;

interface TaskComponentProps {
  task: TaskItem;
  deleteTask: () => void;
  isOwner: boolean;
  handle_Like_Reply_Share_Interaction: (taskUuid: string, type: string) => void;
  currentUserUuid: string | null;
  onEdit: (uuid: string) => void;
}

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

  const TaskTyped = Task as React.ComponentType<TaskComponentProps>;

  if (isLoading && tasks.length === 0) return <FullPageLoader />;

  return (
    <div className="pneuma-app-shell">
      <NavBarTyped currentUserUuid={userUuid} />
      <div className="pneuma-main-stage">
        <main className="pneuma-central-feed">
          <div className="pneuma-stream-wrapper">
            {tasks.map((task: TaskItem) => (
              <TaskTyped
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

export default HomeFeed;