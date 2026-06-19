import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import "../styles/Profile.css";
import TaskContext from "../context/TaskContext.jsx";

// Import your newly divided sub-components cleanly
import ProfileEngagement from "../components/Profile/Engagement.jsx";
import ProfileJournal from "../components/Profile/Journal.jsx";

const Profile = () => {
  const { targetProfileUuid } = useParams();
  const navigate = useNavigate();
  const author_profile_uuid = targetProfileUuid;
  const { followStates, update_Global_Follow_Toggle } = useContext(TaskContext);

  // 1. Core Profile States
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [relationStatus, setRelationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Data Fetching Sync System
  useEffect(() => {
    const fetchSmartProfileData = async () => {
      setIsLoading(true);
      try {
        // Change your fetch line inside Profile.jsx to this:
        const endpoint = author_profile_uuid
          ? `/task/profile/${author_profile_uuid}`
          : `/task/profile/undefined`;

        console.log("fetching profile for ", endpoint);

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
  // 3. Follow Toggle Trigger Logic connected to Context
  const handleFollowToggle = () => {
    // 🚨 Pass the unified variable name straight to context toggle!
    update_Global_Follow_Toggle(author_profile_uuid, relationStatus);
  };

  // 3. Follow Toggle Trigger Logic
  let activeRelationStatus;

  if (followStates[author_profile_uuid] !== undefined) {
    activeRelationStatus = followStates[author_profile_uuid];
  } else {
    activeRelationStatus = relationStatus;
  }
  // 4. Private Messaging Initialization Tunnel
  const handleMessageInitialization = async () => {
    if (!profile?.id) return;
    try {
      // Send the target profile's internal numeric ID to build or find the room
      const res = await api.post("/task/fetchConversation", {
        targetUserProfileId: profile.id,
      });

      const { conversationId } = res.data;
      console.log("🎯 Secured Conversation Room Container ID:", conversationId);

      // Navigate straight to your messaging layout with this active room container ID
      navigate(`/messages/${conversationId}`);
    } catch (err) {
      console.error("❌ Room initialization failed:", err.message);
      alert("Could not open message sanctuary room container.");
    }
  };

  // 5. Protective Loading Cover Gate
  if (isLoading) {
    return (
      <div className="profile-loading-screen">
        Reflecting on profile journal...
      </div>
    );
  }

  return (
    <div className="profile-sanctuary-master-frame">
      {/* 📜 Profile Identity Visual Section */}
      <>
        <p className="profile-author-fullname">
          {profile?.first_name} {profile?.last_name}
        </p>
        <span className="profile-counter-stats">
          Followers: {profile?.followers_count || 0} | Following:
          {profile?.following_count || 0}
        </span>
      </>

      {/* 🛠️ COMPONENT 1: Divided Dynamic Interaction Dock */}
      <ProfileEngagement
        isOwner={isOwner}
        relationStatus={activeRelationStatus}
        handleFollowToggle={handleFollowToggle}
        onMessageClick={handleMessageInitialization}
      />

      {/* 📜 COMPONENT 2: Divided Rolling Journal Scroll Feed */}
      <ProfileJournal
        isOwner={isOwner}
        relationStatus={activeRelationStatus}
        tasks={tasks}
        navigate={navigate}
        currentUserUuid={profile?.uuid}
      />
    </div>
  );
};

export default Profile;
