import React from "react";

const ProfileEngagement = ({
  isOwner,
  active_Relation_Follow_Status,
  handleFollowToggle,
  onMessageClick,
}) => {
  return (
    <div className="profile-interaction-dock">
      {isOwner ? (
        /* 🎯 STATE 1: OWNER ACTION PANEL */
        <div className="engagement-btn-group">
          <button className="profile-btn btn-owner">
            Modify My Sanctuary Journal
          </button>
        </div>
      ) : active_Relation_Follow_Status === null ? (
        /* 🎯 STATE 2: STRANGER ACTION PANEL */
        <div className="engagement-btn-group">
          <button
            onClick={handleFollowToggle}
            className="profile-btn btn-follow"
          >
            + Follow
          </button>
          <button
            onClick={() =>
              alert(
                "To protect the purity of this sanctuary, private messages are locked until your follow connection request is accepted by the author.",
              )
            }
            className="profile-btn btn-locked"
          >
            Message
          </button>
        </div>
      ) : active_Relation_Follow_Status === "pending" ? (
        /* 🎯 STATE 3: PENDING ACTION PANEL */
        <div className="engagement-btn-group">
          <button
            onClick={handleFollowToggle}
            className="profile-btn btn-requested"
          >
            Requested...
          </button>
          <button
            onClick={() =>
              alert(
                "To protect the purity of this sanctuary, private messages are locked until your follow connection request is accepted by the author.",
              )
            }
            className="profile-btn btn-locked"
          >
            Message
          </button>
        </div>
      ) : (
        /* 🎯 STATE 4: APPROVED FRIEND ACTION PANEL */
        <div className="engagement-btn-group">
          <button
            onClick={handleFollowToggle}
            className="profile-btn btn-following"
          >
          </button>
          <button onClick={onMessageClick} className="profile-btn btn-message">
            Message
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileEngagement;
