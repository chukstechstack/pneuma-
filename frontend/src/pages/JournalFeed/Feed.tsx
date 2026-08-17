import React from "react";
import Task from "@components/Task/Task";
import NavBar from "@/pages/NavBar/NavBar";
import FullPageLoader from "@components/Loader.jsx";
import { useJournalData } from "@/pages/JournalFeed/useJournalData";
import { JournalTask } from "@/pages/JournalFeed/Page.types";


interface TaskProps {
  key: string;
  task: JournalTask;
  isOwner: boolean;
  deleteTask: () => void;
  onEdit: (uuid: string) => void;
  handle_Like_Reply_Share_Interaction: (taskUuid: string, type: string) => void;
  currentUserUuid: string | null | undefined;
}

const JournalPage = (): React.ReactElement => {
  const {
    journalTasks,
    isOwner,
    isLoading,
    isFetchingNextPage,
    userUuid,
    ref,
    deleteSelectedTask,
    navigate,
  } = useJournalData();

  const handle_Like_Reply_Share_Interaction = (
    taskUuid: string,
    type: string
  ) => {
    // no-op handler when interaction callback is not provided by the hook
  };

  const TaskTyped = Task as unknown as React.ComponentType<TaskProps>;

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="home-layout">
      <NavBar />
      <div className="dashboard-grid">
        <main
          className="timeline-feed-wrapper"
          style={{ gridColumn: "span 2" }}
        >
          <div className="journal-header-banner"></div>

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
                  handle_Like_Reply_Share_Interaction={handle_Like_Reply_Share_Interaction}
                  currentUserUuid={userUuid ?? ""}
                />
              ))
            )}

            <div ref= {ref} style={{ height: "20px" }}>
              {isFetchingNextPage && <p>Loading more...</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JournalPage;