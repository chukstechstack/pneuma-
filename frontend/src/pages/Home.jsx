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
    Global_Engagement_Updater_For_Connect_Request,
    FreshLoad,
    has_Next_Post_Timestamp,
  } = useContext(TaskContext);

  // =================Pagination_Scroll=================================
  useEffect(() => {
    const handleScroll = () => {
      if (!has_Next_Post_Timestamp) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        FreshLoad(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [FreshLoad, has_Next_Post_Timestamp]);
  // ================End=============
  // ==============Handle_Follow_Request=========================================
  const handle_Engagement_Request_For_Connect = (
    author_profile_uuid,
    currentTaskRelationStatus,
  ) => {
    if (currentUserUuid === author_profile_uuid) {
      alert("You cannot follow your own sanctuary profile.");
      return;
    }

    Global_Engagement_Updater_For_Connect_Request(
      author_profile_uuid,
      currentTaskRelationStatus,
    );
  };
  // ================End=============

  // ==============handle_Like_Reply_Share_Interaction =========================================
  const handle_Like_Reply_Share_Interaction = async (taskUuid, type) => {
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
  // ================End=============

  // ==============Deletetask_Request=========================================
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
  // ================End=============

  // ================Load_SPinner==============================================
  if (contextLoading && tasks.length === 0) {
    return <FullPageLoader />;
  }
  // ================End=============
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
                handle_Like_Reply_Share_Interaction={
                  handle_Like_Reply_Share_Interaction
                }
                handle_Engagement_Request_For_Connect={(author_profile_uuid) =>
                  handle_Engagement_Request_For_Connect(
                    author_profile_uuid,
                    task.relation_status,
                  )
                }
                currentUserUuid={currentUserUuid}
              />
            ))}
          </div>

          {/*----Entry_Loader_Spinner*/}
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
