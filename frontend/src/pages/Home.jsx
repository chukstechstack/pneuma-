import { Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import { useContext, useState } from "react";
import api from "../api/axios.js";
import Task from "../components/HomeTaskInput.jsx";
import NavBar from "../components/NavBar";
import "../styles/Home.css";
import DevBanner from "../components/DevBanner";
import FullPageLoader from "../components/Loader.jsx";

const HomePage = () => {
  const { tasks, deleteTaskFromState, currentUserId, loading: contextLoading } =
    useContext(TaskContext);
  const [isDeleting, seIsDeleting] = useState(false);

  const deleteTask = async (uuid) => {
    try {
      seIsDeleting(true);
      await api.delete(`/task/${uuid}`);
      deleteTaskFromState(uuid);
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      console.log(message);
    } finally {
      seIsDeleting(false);
    }
  };

  if (contextLoading || isDeleting) {
    return <FullPageLoader />;
  }

  return (
    <div className="home-layout">
      <DevBanner />
      <NavBar />

      <div className="dashboard-grid">
        {/* PROFILE SIDEBAR SECTION (Left - Desktop Only) */}
        <aside className="profile-sidebar-wrapper">
          <div className="profile-sanctuary-card">
            <div className="profile-card-banner" />

            <div className="profile-image-container">
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                alt="profile"
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

        {/* TIMELINE FEED SYSTEM (Right) */}
        <main className="timeline-feed-wrapper">
          <div className="create-testimony-trigger-panel">
            <img
              src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250"
              alt="profile"
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
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                isOwner={task.user_id === currentUserId}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
