import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import Task from "../components/HomeTaskInput.jsx";
import NavBar from "../components/NavBar";
import FullPageLoader from "../components/Loader.jsx";

const JournalPage = () => {
  const { targetUserUuid } = useParams();

  const {
    privateFeedTasks,
    journalLoading,
    privateFeedHandler,
    currentUserId,
    currentUserUuid,
    toggle_Engagement_In_React_State,
    deleteTaskFromState,
    update_Follow_Request_In_useContext_State,
    has_Next_Journal_Timestamp,
  } = useContext(TaskContext);

  useEffect(() => {
    const handleScroll = () => {
      if (!has_Next_Journal_Timestamp) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        privateFeedHandler(targetUserUuid, false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetUserUuid, privateFeedHandler, has_Next_Journal_Timestamp]);

  useEffect(() => {
    if (targetUserUuid) {
      privateFeedHandler(targetUserUuid, true);
    }
  }, [targetUserUuid, privateFeedHandler]);

  const journalTask = Array.isArray(privateFeedTasks) ? privateFeedTasks : [];

  if (journalLoading && journalTask.length === 0) {
    return <FullPageLoader />;
  }

  return (
    <div className="home-layout">
      <NavBar currentUserUuid={currentUserUuid} />

      <div className="dashboard-grid">
        <main
          className="timeline-feed-wrapper"
          style={{ gridColumn: "span 2" }}
        >
          <div
            className="journal-header-banner"
            style={{
              padding: "20px 0",
              borderBottom: "1px solid var(--border-subtle)",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--accent-gold)",
                margin: 0,
              }}
            >
              📖 The Chronicle Sanctuary
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                marginTop: "4px",
              }}
            >
              A personal repository of your written testimonies and echoed
              insights.
            </p>
          </div>

          <div className="timeline-posts-container">
            {journalTask.length === 0 ? (
              <div
                className="empty-journal-message"
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "var(--text-muted)",
                }}
              >
                No testimonies or echoed insights saved inside this sanctuary
                yet.
              </div>
            ) : (
              journalTask.map((task, index) => (
                <Task
                  key={`${task.uuid || task.id}-${index}`}
                  task={task}
                  deleteTask={deleteTaskFromState}
                  isOwner={task.user_id === currentUserId}
                  handleInteraction={toggle_Engagement_In_React_State}
                  handleFollow={update_Follow_Request_In_useContext_State}
                  currentUserUuid={currentUserUuid}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JournalPage;
