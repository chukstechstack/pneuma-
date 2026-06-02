import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import Task from "../components/HomeTaskInput.jsx";
import NavBar from "../components/NavBar";
import FullPageLoader from "../components/Loader.jsx";

// Reuses your main workspace layout architecture

const JournalPage = () => {
  const { journalUuid } = useParams();

  const {
    journalTasks,
    journalLoading,
    getJournalFeed,
    currentUserId,
    currentUserUuid,
    // 🔽 FIXED: We use your exact function names from TaskContext.jsx
    toggleInteractionInState,
    deleteTaskFromState,
    toggleFollowInState,
  } = useContext(TaskContext);

  // Auto-load your database information on arrival
  useEffect(() => {
    if (journalUuid) {
      getJournalFeed(journalUuid);
    }
  }, [journalUuid, getJournalFeed]);

  // 🛡️ THE SPINNER SHIELD: Shows your spinner while the database works
  if (journalLoading) {
    return <FullPageLoader />;
  }

  // 🛡️ THE ARRAY SHIELD: Prevents crashing if the data is missing or wrong
  const journalTask = Array.isArray(journalTasks) ? journalTasks : [];

  return (
    <div className="home-layout">
      {/* <DevBanner /> */}
      <NavBar />

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
              journalTask.map((task) => (
                <Task
                  key={task.uuid || task.id}
                  task={task}
                  // 🔽 FIXED: Pass the correct functions into the card properties
                  deleteTask={deleteTaskFromState}
                  isOwner={task.user_id === currentUserId}
                  handleInteraction={toggleInteractionInState}
                  handleFollow={toggleFollowInState}
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
