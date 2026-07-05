import React from "react";

const ProfileJournal = ({
  isOwner,
  active_Relationtionship_Request_Status,
  tasks,
  navigate,
  currentUserUuid,
}) => {
  const isAuthorized =
    isOwner || active_Relationtionship_Request_Status === "active";

  return (
    <div className="profile-journal-scroll-section">
      {isAuthorized ? (
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
              {tasks.slice(0, 5).map((task) => (
                <div key={task.uuid} className="profile-journal-card">
                  <p className="journal-card-content">{task.content}</p>
                  <span className="journal-card-date">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
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
        <div className="profile-lock-overlay-panel">
          <div className="lock-icon-indicator">🔒</div>
          <h4 className="lock-panel-headline">Scrolls Locked by Author</h4>
          <p className="lock-panel-subtext">
            Follow this author to request access to their 5 newest rolling life
            reflections.
          </p>
        </div>
      )}
    </div>
  );
};
export default ProfileJournal;
