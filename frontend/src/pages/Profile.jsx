import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import api from "../api/axios.js";

const Profile = () => {
  const navigate = useNavigate();
  const { targetProfileUuid } = useParams();
  const { currentUserUuid } = useContext(TaskContext);

  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [relationStatus, setRelationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSmartProfileData = async () => {
      setIsLoading(true);
      try {
        const target_User_Uuid = targetProfileUuid || currentUserUuid;
        console.log("🚀 Fetching profile walk data for UUID:", target_User_Uuid);
        
        const res = await api.get(`/task/profile/${target_User_Uuid}`);
        setProfile(res.data.profile);
        setTasks(res.data.tasks);
        setIsOwner(res.data.isOwner);
        setRelationStatus(res.data.relationStatus);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserUuid) {
      fetchSmartProfileData();
    }
  }, [targetProfileUuid, currentUserUuid]);

  // Protective Guard Gate 1: Loading State
  if (isLoading) {
    return (
      <div style={{ color: "#7aa2f7", padding: "20px" }}>
        Reflecting on profile journal...
      </div>
    );
  }

  // Protective Guard Gate 2: Missing Data Shield
  if (!profile) {
    return (
      <div style={{ color: "#ff757f", padding: "20px" }}>
        Profile not found in this sanctuary.
      </div>
    );
  }

  return (
    <div className="profile-page-root">
      {/* ==================== 1. COVER BANNER VIEW ==================== */}
      <div className="profile-cover-banner-container">
        <div className="profile-cover-banner-gradient" />
      </div>

      {/* ==================== 2. IDENTITY HEADER VIEW ==================== */}
      <div>
        <div className="profile-avatar-frame">
          <img 
            src={profile.avatar_url || "https://placeholder.com"} 
            alt="Author Avatar" 
            className="profile-display-avatar"
          />
        </div>

        <div className="profile-meta-details">
          <h2 className="profile-full-name">
            {profile.first_name} {profile.last_name}
          </h2>
          <span className="profile-username-handle">@{profile.username}</span>
          <p className="profile-biography-text">
            {profile.bio || "Walking in grace, documenting the script written by God."}
          </p>
        </div>

        <div className="profile-social-metrics-bar">
          <span className="metric-item"><strong>{profile.following_count || 0}</strong> Mentors</span>
          <span className="metric-item"><strong>{profile.followers_count || 0}</strong> Disciples</span>
        </div>
      </div>

      {/* ==================== 3. DYNAMIC BUTTON INTERACTION INTERFACE ==================== */}
      <div className="profile-interaction-dock">
        {isOwner ? (
          /* 🎯 STATE 1: OWNER ACTION PANEL */
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ padding: "8px 16px", background: "#3b4252", color: "white", border: "none", borderRadius: "6px", fontWeight: "500" }}>
              Modify My Sanctuary Journal
            </button>
          </div>
        ) : relationStatus === null ? (
          /* 🎯 STATE 2: STRANGER ACTION PANEL */
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ padding: "8px 16px", background: "#7aa2f7", color: "white", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer" }}>
              + Follow
            </button>
            <button 
              onClick={() => alert("To protect the purity of this sanctuary, private messages are locked until your follow connection request is accepted by the author.")}
              style={{ padding: "8px 16px", background: "#1f2335", color: "#565f89", border: "1px solid #414868", borderRadius: "6px", opacity: 0.6, cursor: "pointer" }}
            >
              Message
            </button>
          </div>
        ) : relationStatus === "pending" ? (
          /* 🎯 STATE 3: PENDING ACTION PANEL */
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ padding: "8px 16px", background: "#414868", color: "#a9b1d6", border: "none", borderRadius: "6px", fontWeight: "500" }}>
              Requested...
            </button>
            <button 
              onClick={() => alert("To protect the purity of this sanctuary, private messages are locked until your follow connection request is accepted by the author.")}
              style={{ padding: "8px 16px", background: "#1f2335", color: "#565f89", border: "1px solid #414868", borderRadius: "6px", opacity: 0.6, cursor: "pointer" }}
            >
              Message
            </button>
          </div>
        ) : (
          /* 🎯 STATE 4: APPROVED FRIEND ACTION PANEL */
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ padding: "8px 16px", background: "#bb9af7", color: "white", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer" }}>
              ✓ Following
            </button>
            <button style={{ padding: "8px 16px", background: "#24283b", color: "#7aa2f7", border: "1px solid #7aa2f7", borderRadius: "6px", fontWeight: "500", cursor: "pointer" }}>
              Message
            </button>
          </div>
        )}
      </div>

      {/* ==================== 4. CHRONOLOGICAL SCROLL VIEW ==================== */}
      <div className="profile-journal-scroll-section">
        {isOwner || relationStatus === "active" ? (
          /* 🎯 UNLOCKED VIEW LAYER (Owner or Active Friend) */
          <>
            <h3 className="profile-feed-title">Rolling Journal Scrolls (5 Newest)</h3>
            {tasks.length === 0 ? (
              <p className="profile-feed-empty">This author hasn't recorded any public scrolls yet.</p>
            ) : (
              <div className="profile-feed-list">
                {tasks.map((task) => (
                  <div key={task.uuid} className="profile-journal-card">
                    <p className="journal-card-content">{task.content}</p>
                    <span className="journal-card-date">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Owner Navigation Tunnel Hook */}
            {isOwner && (
              <button 
                onClick={() => navigate(`/journalfeed/${currentUserUuid}`)}
                className="profile-sanctuary-redirect-btn"
              >
                Enter My Full Private Sanctuary Journal →
              </button>
            )}
          </>
        ) : (
          /* 🎯 BLURRED TEASER PLACEHOLDER LAYER (Stranger or Pending) */
          <>
            <h3 className="profile-feed-title">Rolling Journal Scrolls</h3>
            
            <div className="profile-teaser-stack-blurred">
              <div className="profile-journal-card-placeholder">
                <div className="skeleton-content-line" />
                <div className="skeleton-content-line-short" />
              </div>
              <div className="profile-journal-card-placeholder">
                <div className="skeleton-content-line" />
                <div className="skeleton-content-line-mid" />
              </div>
            </div>

            <div className="profile-lock-overlay-panel">
              <div className="lock-icon-indicator">🔒</div>
              <h4 className="lock-panel-headline">Scrolls Locked by Author</h4>
              <p className="lock-panel-subtext">
                Follow this author to request access to their 5 newest rolling life reflections.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
