import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import TaskContext from "../../context/TaskContext.jsx";

const ProfileEngagement = ({
  isOwner,
  active_Relationtionship_Request_Status,
  connect_Request_Handler,
  onMessageClick,
  author_profile_uuid,
}) => {
  const [inner_Circle_Connections, set_Inner_Circle_Connections] = useState([]);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [dockLoading, setDockLoading] = useState(false);
  const { refreshCounter } = useContext(TaskContext);

  useEffect(() => {
    const view_Inner_Circle = async () => {
      setDockLoading(true);
      try {
        const res = await api.get(
          `/task/profile/innerCircle-details/${author_profile_uuid || "me"}`,
        );
        set_Inner_Circle_Connections(res.data.list || []);
      } catch (err) {
        console.error("Connection fetch failed:", err);
      } finally {
        setDockLoading(false);
      }
    };
    view_Inner_Circle();
  }, [author_profile_uuid, refreshCounter]);

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
          {active_Relationtionship_Request_Status === "active" && (
            <button onClick={() => setIsDockOpen(true)}>
              View Inner Circle
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
                  inner_Circle_Connections.map((user) => (
                    <div key={user.uuid} className="connection-member">
                      <Link
                        to={`/profile/${user.uuid}`}
                        onClick={() => setIsDockOpen(false)}
                      >
                        <img
                          src={user.avatar_url || "/default-avatar.png"}
                          alt={user.first_name}
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
        </div>
      )}
    </div>
  );
};
export default ProfileEngagement;
