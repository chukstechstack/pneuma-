
import { Link } from "react-router-dom";

import TaskContext from "../../context/TaskContext.jsx";

const ProfileEngagement = ({
  isOwner,
  active_Relationtionship_Request_Status,
  connect_Request_Handler,
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
      ) : (
        <div className="engagement-btn-group">
          <button
            onClick={connect_Request_Handler}
            className={`profile-btn ${active_Relationtionship_Request_Status === "active" ? "btn-following" : active_Relationtionship_Request_Status === "pending" ? "btn-requested" : "btn-follow"}`}
          >
            {active_Relationtionship_Request_Status === "active"
              ? "UnConnect"
              : active_Relationtionship_Request_Status === "pending"
                ? "Requested..."
                : "+ Connect"}
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
