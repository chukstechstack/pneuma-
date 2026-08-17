import React from "react";
import { Link } from "react-router-dom";
import ProfileEngagement from "@/components/Profile/Engagement.js";
import ProfileJournal from "@components/Profile/Journal.jsx";
import { useProfileData } from "@pages/Profile/useProfileData";
import { InnerCircleUser } from "@pages/Profile/Profile.types";


const Profile = () => {
  const {
    isDockOpen,
    setIsDockOpen,
    data,
    isLoading,
    isError,
    innerCircle,
    dockLoading,
    toggleConnection,
    handleMessageInitialization,
    currentUserUuid,
    navigate,
  } = useProfileData();

  if (isLoading)
    return <div className="profile-loading-screen">Reflecting on profile journal...</div>;
  if (isError) return <div>Error loading profile.</div>;

  const { profile, tasks, isOwner, relationStatus } = data!;

  return (
    <div className="profile-sanctuary-master-frame">
      <p className="profile-author-fullname">
        {profile.first_name} {profile.last_name}
      </p>

      {(relationStatus === "active" || isOwner) && (
        <button onClick={() => setIsDockOpen(true)}>
          {isOwner ? "View My Inner Circle" : "View Inner Circle"}
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
              innerCircle.map((user: InnerCircleUser) => (
                <div key={user.uuid} className="connection-member">
                  <Link to={`/profile/${user.uuid}`} onClick={() => setIsDockOpen(false)}>
                    <img
                      src={user.avatar_url || "/default-avatar.png"}
                      className="connection-avatar"
                      alt={`${user.first_name}'s avatar`}
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

      <ProfileEngagement
        isOwner={isOwner}
        active_Relationtionship_Request_Status={relationStatus}
        connect_Request_Handler={() => {
          const action =
            relationStatus === "active" || relationStatus === "pending" ? "disconnect" : "connect";
          (toggleConnection as unknown as (arg: any) => void)(action);
        }}
        onMessageClick={() => handleMessageInitialization(profile.id)}
      />

      <ProfileJournal
        isOwner={isOwner}
        active_Relationtionship_Request_Status={relationStatus}
        tasks={tasks}
        navigate={navigate}
        currentUserUuid={currentUserUuid}
      />
    </div>
  );
};

export default Profile;