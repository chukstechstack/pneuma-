import React, { useContext } from "react";
import { Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import api from "../api/axios.js";
import Task from "../components/HomeTaskInput.jsx";
import NavBar from "../components/NavBar";
import DevBanner from "../components/DevBanner";
import FullPageLoader from "../components/Loader.jsx";

// Import your unified styles framework
import "../styles/home-file/main.css";

const HomePage = () => {
  const {
    tasks,
    deleteTaskFromState,
    restoreTaskToState,
    currentUserId,
    loading: contextLoading,
    updateSingleTaskInState,
    toggleInteractionInState,
  } = useContext(TaskContext);

 const handleInteraction = async (taskUuid, type) => {
  console.log("1. Click triggered for UUID:", taskUuid, "Type:", type); 
  
  // 🔽 FIXED: Added .toLowerCase() to both sides to prevent casing bugs!
  const originalTask = tasks.find(
    (t) => t.uuid?.toLowerCase() === taskUuid?.toLowerCase()
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

  const defaultProfileImg =
    "https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250";

  return (
    <div className="home-layout">
      <DevBanner />
      <NavBar />

      <div className="dashboard-grid">
        {/* PROFILE SIDEBAR SECTION */}
        <aside className="profile-sidebar-wrapper">
          <div className="profile-sanctuary-card">
            <div className="profile-card-banner" />

            <div className="profile-image-container">
              <img
                src={defaultProfileImg}
                alt="Profile avatar"
                className="profile-avatar-img"
              />
            </div>

            <div className="profile-info-block">
              <h3 className="profile-display-name">Chukwunyelu Ki...</h3>
              <p className="profile-app-role">Sanctuary Keeper</p>
            </div>

            <div className="profile-action-footer">
              <Link to="/profile" className="profile-view-link-btn">
                View Profile
              </Link>
            </div>
          </div>
        </aside>

        {/* TIMELINE FEED SYSTEM */}
        <main className="timeline-feed-wrapper">
          <div className="create-testimony-trigger-panel">
            <img
              src={defaultProfileImg}
              alt="Feed avatar thumbnail"
              className="feed-avatar-thumbnail"
            />
            <Link
              to="/createtask"
              className="share-testimony-input-placeholder"
            >
              Share a testimony or insight...
            </Link>
          </div>

          <div className="timeline-posts-container">
            {tasks.map((task) => (
              <Task
                key={task.uuid || task.id}
                task={task}
                deleteTask={deleteTask}
                isOwner={task.user_id === currentUserId}
                handleInteraction={handleInteraction}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
