import React, { useContext } from "react";
import { Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import api from "../api/axios.js";
import Task from "../components/HomeTaskInput.jsx";
import NavBar from "../components/NavBar";
import FullPageLoader from "../components/Loader.jsx";
import "../styles/HomeFeed.css";
// Import your unified styles framework

const HomePage = () => {
  const {
    tasks,
    deleteTaskFromState,
    restoreTaskToState,
    currentUserId,
    currentUserUuid,
    loading: contextLoading,
    updateSingleTaskInState,
    toggleInteractionInState,
    toggleFollowInState,
  } = useContext(TaskContext);

  const handleFollow = async (targetAuthorUuid) => {
    // 🧠 SAFETY GATES: Stop the click early if a user tries to follow themselves!
    if (currentUserUuid === targetAuthorUuid) {
      alert("You cannot follow your own sanctuary profile.");
      return;
    }

    toggleFollowInState(targetAuthorUuid);
    try {
      const res = await api.post(`/task/profile/follow/${targetAuthorUuid}`);
      const isFollowingServerTruth = res.data.isFollowing;
      console.log(
        `✅ [FOLLOW SYNCED]: Follow status changed to ${isFollowingServerTruth}`,
      );
    } catch (err) {
      console.error("❌ Follow action failed on network level:", err);
      alert(
        "Unable to update follow connection. Please check your internet connection.",
      );
      toggleFollowInState(targetAuthorUuid);
    }
  };
  const handleInteraction = async (taskUuid, type) => {
    console.log("1. Click triggered for UUID:", taskUuid, "Type:", type);
    // 🔽 FIXED: Added .toLowerCase() to both sides to prevent casing bugs!
    const originalTask = tasks.find(
      (t) => t.uuid?.toLowerCase() === taskUuid?.toLowerCase(),
    );
    if (!originalTask) {
      console.log("❌ Stopped: Could not find matching UUID in tasks array!");
      return;
    }
    console.log("2. Task found! Sending to backend...");
    // 🔽 Pass the actual task.uuid from the array to keep things perfectly safe
    const stableUuid = originalTask.uuid;
    toggleInteractionInState(stableUuid, type);

    try {
      const res = await api.post(`/task/interaction/${stableUuid}`, { type });
      const updatedPost = res.data.updatedPost;
      updateSingleTaskInState(updatedPost, type);
    } catch (err) {
      console.error("Backend failed, rolling back UI change:", err);
      toggleInteractionInState(stableUuid, type);
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

  if (contextLoading) {
    return <FullPageLoader />;
  }

  return (
    /* 🚀 RENEWED BRAND NEW STRUCTURAL WRAPPERS */
    <div className="pneuma-app-shell">
      <NavBar currentUserUuid={currentUserUuid} />
      <div className="pneuma-main-stage">
        {/* PROFILE SIDEBAR SECTION */}
        <aside className="pneuma-left-wing-sidebar">
          <div className="profile-sanctuary-card">
            <div className="profile-card-banner" />

            <div className="profile-info-block">
              <h3 className="profile-display-name">Chukwunyelu Ki...</h3>
              <p className="profile-app-role">Sanctuary Keeper</p>
            </div>

            <div className="sidebar-journal-nav-wrapper"></div>
          </div>
        </aside>

        {/* TIMELINE FEED SYSTEM */}
        <main className="pneuma-central-feed">
          <div className="create-testimony-trigger-panel">
            {/* <Link
              to="/createtask"
              className="share-testimony-input-placeholder"
            >
              Share a testimony or insight...
            </Link> */}
          </div>

          <div className="pneuma-stream-wrapper">
            {tasks.map((task) => (
              <Task
                key={task.uuid || task.id}
                task={task}
                deleteTask={deleteTask}
                isOwner={task.user_id === currentUserId}
                handleInteraction={handleInteraction}
                handleFollow={handleFollow}
                currentUserUuid={currentUserUuid}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
