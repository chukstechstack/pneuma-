import React from "react";

const ProfileJournal = ({
  isOwner,
  relationStatus,
  tasks,
  navigate,
  currentUserUuid,
}) => {
  return (
    <div className="profile-journal-scroll-section">
      {isOwner || relationStatus === "active" ? (
        /* 🎯 UNLOCKED VIEW LAYER (Owner or Active Friend) */
        <>
          <h3 className="profile-feed-title">
            Rolling Journal Scrolls (5 Newest)
          </h3>
          {tasks.length === 0 ? (
            <p className="profile-feed-empty">
              This author hasn't recorded any public scrolls yet.
            </p>
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
              Follow this author to request access to their 5 newest rolling
              life reflections.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileJournal;
