import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import "../styles/Profile.css";
import TaskContext from "../context/TaskContext.jsx";
import ProfileEngagement from "../components/Profile/Engagement.jsx";
import ProfileJournal from "../components/Profile/Journal.jsx";
import PendingRequest from "../components/Pending-Requests";

const Profile = () => {
  const { targetProfileUuid } = useParams();
  const navigate = useNavigate();
  const author_profile_uuid = targetProfileUuid;

  const {
    engagement_Request_Status,
    Global_Engagement_Updater_For_Connect_Request,
    refreshCounter,
  } = useContext(TaskContext);

  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [relationStatus, setRelationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [innerCircle, setInnerCircle] = useState([]);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [dockLoading, setDockLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const endpoint = author_profile_uuid
          ? `/task/profile/${author_profile_uuid}`
          : `/task/profile/me`;
        const res = await api.get(endpoint);
        setProfile(res.data.profile);
        setTasks(res.data.tasks);
        setIsOwner(res.data.isOwner);
        setRelationStatus(res.data.relationStatus);
        console.log(res)
      } catch (err) {
        console.error("❌ Profile retrieval failed:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [author_profile_uuid]);

  useEffect(() => {
    const fetchInnerCircle = async () => {
      setDockLoading(true);
      try {
        const res = await api.get(
          `/task/profile/innerCircle-details/${author_profile_uuid || "me"}`,
        );
        setInnerCircle(res.data.list || []);
        console.log(res)
      } catch (err) {
        console.error("Connection fetch failed:", err);
      } finally {
        setDockLoading(false);
      }
    };
    fetchInnerCircle();
  }, [author_profile_uuid, refreshCounter]);

  const activeRelationshipStatus =
    engagement_Request_Status[author_profile_uuid] ?? relationStatus;

  useEffect(() => {
    if (activeRelationshipStatus === "active" && !isOwner) {
      const fetchTasksOnActivation = async () => {
        try {
          const res = await api.get(`/task/profile/${author_profile_uuid}`);
          setTasks(res.data.tasks);
          console.log(res)
        } catch (err) {
          console.error(
            "❌ Failed to fetch journal after activation:",
            err.message,
          );
        }
      };
      fetchTasksOnActivation();
    }
  }, [activeRelationshipStatus, author_profile_uuid, isOwner]);

  const connectRequestHandler = () => {
    Global_Engagement_Updater_For_Connect_Request(
      author_profile_uuid,
      activeRelationshipStatus,
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

  if (isLoading)
    return (
      <div className="profile-loading-screen">
        Reflecting on profile journal...
      </div>
    );

  return (
    <div className="profile-sanctuary-master-frame">
      <p className="profile-author-fullname">
        {profile?.first_name} {profile?.last_name}
      </p>

      <PendingRequest currentUserUuid={profile?.uuid} />

      {(activeRelationshipStatus === "active" || isOwner) && (
        <button onClick={() => setIsDockOpen(true)}>
          {isOwner ? "View My Inner Circle" : "View Inner Circle"}
        </button>
      )}

      {isDockOpen && (
        <div className="drawer-overlay">
          <div className="drawer-content">
            <button onClick={() => setIsDockOpen(false)}>Close</button>
            <h3>Your Connections</h3>
            {dockLoading ? (
              <p>Loading...</p>
            ) : (
              innerCircle.map((user) => (
                <div key={user.uuid} className="connection-member">
                  <Link
                    to={`/profile/${user.uuid}`}
                    onClick={() => setIsDockOpen(false)}
                  >
                    <img
                      src={user.avatar_url || "/default-avatar.png"}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="connection-avatar"
                    />
                  </Link>
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <ProfileEngagement
        isOwner={isOwner}
        active_Relationtionship_Request_Status={activeRelationshipStatus}
        connect_Request_Handler={connectRequestHandler}
        onMessageClick={handleMessageInitialization}
        author_profile_uuid={author_profile_uuid}
      />

      <ProfileJournal
        isOwner={isOwner}
        active_Relationtionship_Request_Status={activeRelationshipStatus}
        tasks={tasks}
        navigate={navigate}
        currentUserUuid={profile?.uuid}
      />
    </div>
  );
};

export default Profile;
