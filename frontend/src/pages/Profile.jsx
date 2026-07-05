import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  } = useContext(TaskContext);

  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [relationStatus, setRelationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSmartProfileData = async () => {
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
      } catch (err) {
        console.error("❌ Profile retrieval failed:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSmartProfileData();
  }, [author_profile_uuid]);

  // Centralized status calculation
  const active_Relationtionship_Request_Status =
    engagement_Request_Status[author_profile_uuid] !== undefined
      ? engagement_Request_Status[author_profile_uuid]
      : relationStatus;

  // Centralized handler
  const connect_Request_Handler = () => {
    Global_Engagement_Updater_For_Connect_Request(
      author_profile_uuid,
      active_Relationtionship_Request_Status,
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
      <PendingRequest />
      <ProfileEngagement
        isOwner={isOwner}
        active_Relationtionship_Request_Status={
          active_Relationtionship_Request_Status
        }
        connect_Request_Handler={connect_Request_Handler}
        onMessageClick={handleMessageInitialization}
        author_profile_uuid={author_profile_uuid}
      />
      <ProfileJournal
        isOwner={isOwner}
        active_Relationtionship_Request_Status={
          active_Relationtionship_Request_Status
        }
        tasks={tasks}
        navigate={navigate}
        currentUserUuid={profile?.uuid}
      />
    </div>
  );
};

export default Profile;
