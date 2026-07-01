import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import "../styles/Profile.css";
import TaskContext from "../context/TaskContext.jsx";

// Import sub-components
import ProfileEngagement from "../components/Profile/Engagement.jsx";
import ProfileJournal from "../components/Profile/Journal.jsx";
import PendingRequest from "../components/Pending-Requests";

const Profile = () => {
  const { targetProfileUuid } = useParams();
  const navigate = useNavigate();
  const author_profile_uuid = targetProfileUuid;

  const { followStates, update_Global_Follow_Toggle, refreshCounter } =
    useContext(TaskContext);

  // 1. Core Profile States
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [relationStatus, setRelationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Dock & Connection States
  const [connections, setConnections] = useState([]);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [dockLoading, setDockLoading] = useState(false);

  // 3. Fetch Connections (Reactive to refreshCounter)
  useEffect(() => {
    const prefetchConnections = async () => {
      setDockLoading(true);
      try {
        const targetProfileUuid = author_profile_uuid || "me";
        const res = await api.get(
          `/task/profile/engagement-details/${targetProfileUuid}`,
        );
        setConnections(res.data.list || []);
      } catch (err) {
        console.error("Connection fetch failed:", err);
      } finally {
        setDockLoading(false);
      }
    };
    prefetchConnections();
  }, [author_profile_uuid, refreshCounter]);

  // 4. Fetch Profile Data
  useEffect(() => {
    const fetchSmartProfileData = async () => {
      setIsLoading(true);
      try {
        const endpoint = author_profile_uuid
          ? `/task/profile/${author_profile_uuid}`
          : `/task/profile/me`;
        const res = await api.get(endpoint);
        console.log("SERVER RESPONSE DATA:", res.data); //
        setProfile(res.data.profile);
        setTasks(res.data.tasks);
        setIsOwner(res.data.isOwner);
        setRelationStatus(res.data.relationStatus);
      } catch (err) {
        console.error("❌ Profile retrieval failed:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSmartProfileData();
  }, [author_profile_uuid]);

 
  const active_Relation_Follow_Status =
    followStates[author_profile_uuid] !== undefined
      ? followStates[author_profile_uuid]
      : relationStatus;



  const handleFollowToggle = () => {
    update_Global_Follow_Toggle(
      author_profile_uuid,
      active_Relation_Follow_Status,
    );
  };

  const handleMessageInitialization = async () => {
    if (!profile?.id) return;
    try {
      const res = await api.post("/task/fetchConversation", {
        targetUserProfileId: profile.id,
      });
      navigate(`/messages/${res.data.conversationId}`);
    } catch (err) {
      console.error("❌ Room initialization failed:", err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading-screen">
        Reflecting on profile journal...
      </div>
    );
  }

  return (
    <div className="profile-sanctuary-master-frame">
      <p className="profile-author-fullname">
        {profile?.first_name} {profile?.last_name}
      </p>

      {/* Real-time Pending Requests Dock */}
      <PendingRequest />

      <button onClick={() => setIsDockOpen(true)}>View Inner Circle</button>

      {/* Inner Circle Drawer */}
      {isDockOpen && (
        <div className="drawer-overlay">
          <div className="drawer-content">
            <button onClick={() => setIsDockOpen(false)}>Close</button>
            <h3>Your Connections</h3>
            {dockLoading ? (
              <p>Loading...</p>
            ) : connections.length > 0 ? (
              connections.map((user) => (
                <div key={user.uuid} className="connection-member">
                  <Link
                    to={`/profile/${user.uuid}`}
                    onClick={() => setIsDockOpen(false)}
                  >
                    <img
                      src={user.avatar_url || "/default-avatar.png"}
                      alt={user.first_name}
                      className="connection-avatar"
                    />
                  </Link>
                  <div className="connection-info">
                    <span>
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No connections yet.</p>
            )}
          </div>
        </div>
      )}

      <ProfileEngagement
        isOwner={isOwner}
        active_Relation_Follow_Status={active_Relation_Follow_Status}
        handleFollowToggle={handleFollowToggle}
        onMessageClick={handleMessageInitialization}
      />

      <ProfileJournal
        isOwner={isOwner}
        active_Relation_Follow_Status={active_Relation_Follow_Status}
        tasks={tasks}
        navigate={navigate}
        currentUserUuid={profile?.uuid}
      />
    </div>
  );
};

export default Profile;
