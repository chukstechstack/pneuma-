import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import api from "../api/axios.js";
import Task from "../components/HomeTaskInput.jsx";
import NavBar from "../components/NavBar";
import FullPageLoader from "../components/Loader.jsx";
import "../styles/HomeFeed.css";

const HomePage = () => {
  const {
    tasks,
    deleteTaskFromState,
    restoreTaskToState,
    currentUserId,
    currentUserUuid,
    loading: contextLoading,
    update_Engagement_frm_Database,
    toggle_Engagement_In_React_State,
    update_Global_Follow_Toggle,
    getTasks,
    has_Next_Post_Timestamp,
  } = useContext(TaskContext);

  // 🧠 SEAMLESS SCROLL LISTENER FOR HISTORICAL TIMELINE
  useEffect(() => {
    const handleScroll = () => {
      if (!has_Next_Post_Timestamp) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        getTasks(false); // 'false' tells context to APPEND next batch instead of overwriting
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [getTasks, has_Next_Post_Timestamp]);

  const handleFollow = (author_profile_uuid, currentTaskRelationStatus) => {
    if (currentUserUuid === author_profile_uuid) {
      alert("You cannot follow your own sanctuary profile.");
      return;
    }

    // 🚀 MASTER TRIGGER: Fire the global context scoreboard updater directly!
    update_Global_Follow_Toggle(author_profile_uuid, currentTaskRelationStatus);
  };

  const handleInteraction = async (taskUuid, type) => {
    console.log("1. Click triggered for UUID:", taskUuid, "Type:", type);
    const originalTask = tasks.find(
      (t) => t.uuid?.toLowerCase() === taskUuid?.toLowerCase(),
    );
    if (!originalTask) {
      console.log("❌ Stopped: Could not find matching UUID in tasks array!");
      return;
    }
    console.log("2. Task found! Sending to backend...");
    const stableUuid = originalTask.uuid;
    toggle_Engagement_In_React_State(stableUuid, type);

    try {
      const res = await api.post(`/task/interaction/${stableUuid}`, { type });
      const { action, updatedPost } = res.data;
      update_Engagement_frm_Database(updatedPost, type, action);
    } catch (err) {
      console.error("Backend failed, rolling back UI change:", err);
      toggle_Engagement_In_React_State(stableUuid, type);
      alert("Connection failed. Unable to save your response");
    }
  };

  const deleteTask = async (uuid) => {
    const originalIndex = tasks.findIndex((task) => task.uuid === uuid);
    const taskToRestore = tasks[originalIndex];

    if (originalIndex === -1) return;
    deleteTaskFromState(uuid);
    try {
      await api.delete(`/task/${uuid}`);
    } catch (err) {
      restoreTaskToState(taskToRestore, originalIndex);
      const message = err?.response?.data?.error || err.message;
      alert(`Failed to delete: ${message}`);
    }
  };

  if (contextLoading && tasks.length === 0) {
    return <FullPageLoader />;
  }

  return (
    <div className="pneuma-app-shell">
      <NavBar currentUserUuid={currentUserUuid} />
      <div className="pneuma-main-stage">
        {/* TIMELINE FEED SYSTEM ONLY */}
        <main className="pneuma-central-feed">
          <div className="create-testimony-trigger-panel"></div>

          <div className="pneuma-stream-wrapper">
            {tasks.map((task) => (
              <Task
                key={task.uuid || task.id}
                task={task}
                deleteTask={deleteTask}
                isOwner={task.user_id === currentUserId}
                handleInteraction={handleInteraction}
                handleFollow={(author_profile_uuid) =>
                  handleFollow(author_profile_uuid, task.relation_status)
                }
                currentUserUuid={currentUserUuid}
              />
            ))}
          </div>

          {/* SUBTLE FOOTER LOADER */}
          {contextLoading && tasks.length > 0 && (
            <div
              className="pneuma-pagination-loading-indicator"
              style={{ textAlign: "center", padding: "20px", color: "#888" }}
            >
              Reflecting on earlier entries...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
