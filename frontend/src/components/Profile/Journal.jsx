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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="profile-journal-scroll-section">
      {!isAuthorized ? (
        <div className="profile-lock-overlay-panel">
          <div className="lock-icon-indicator">🔒</div>
          <h4 className="lock-panel-headline">Scrolls Locked by Author</h4>
          <p className="lock-panel-subtext">
            Follow this author to request access to their 5 newest reflections.
          </p>
        </div>
      ) : (
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
              {tasks.slice(0, 5).map(({ uuid, content, created_at, img }) => (
                <div key={uuid} className="profile-journal-card">
                  <p className="journal-card-content">{content}</p>
                  {img && (
                    <img
                      src={img}
                      alt="journal"
                      className="journal-card-image"
                    />
                  )}
                  <span className="journal-card-date">
                    {formatDate(created_at)}
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
      )}
    </div>
  );
};

export default ProfileJournal;
