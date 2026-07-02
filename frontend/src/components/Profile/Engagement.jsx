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
        <div className="engagement-btn-group">
          <button className="profile-btn btn-owner">
            Modify My Sanctuary Journal
          </button>
        </div>
      ) : active_Relation_Follow_Status === null ? 
        <div className="engagement-btn-group">
          <button
            onClick={handleFollowToggle}
            className="profile-btn btn-follow"
          >
            + Connect
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
       : active_Relation_Follow_Status === "pending" ? (
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
        <div className="engagement-btn-group">
          <button
            onClick={handleFollowToggle}
            className="profile-btn btn-following"
          ></button>
          <button onClick={onMessageClick} className="profile-btn btn-message">
            Message
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileEngagement;
