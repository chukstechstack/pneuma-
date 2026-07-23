import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios.js";
import "../styles/Profile.css";
import { useConnectionMutation } from "@hooks/useConnections.js";
import ProfileEngagement from "@components/Profile/Engagement.jsx";
import ProfileJournal from "@components/Profile/Journal.jsx";
import { useAuthStore } from "@store/useAuthStore.js";

const Profile = () => {
  const { targetProfileUuid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const currentUserUuid = user?.uuid;
  const uuid = targetProfileUuid || "me";

  const [isDockOpen, setIsDockOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", uuid],
    queryFn: async () => {
      const endpoint = targetProfileUuid
        ? `/task/profile/${targetProfileUuid}`
        : `/task/profile/me`;
      const res = await api.get(endpoint);
      console.log("💤💫Profile Server response:", res);

      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: innerCircle = [], isLoading: dockLoading } = useQuery({
    queryKey: ["innerCircle", uuid],
    queryFn: async () => {
      const res = await api.get(`/task/profile/innerCircle-details/${uuid}`);
      console.log(" ✔️💥 User data:", res);
      return res.data.list || [];
    },
    enabled: isDockOpen,
    initialData: () => queryClient.getQueryData(["innerCircle", uuid]),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { mutate: toggleConnection } = useConnectionMutation(uuid);

  if (isLoading)
    return (
      <div className="profile-loading-screen">
        Reflecting on profile journal...
      </div>
    );
  if (isError) return <div>Error loading profile.</div>;

  const { profile, tasks, isOwner, relationStatus } = data;

  const handleMessageInitialization = async () => {
    try {
      const res = await api.post("/task/fetchConversation", {
        targetUserProfileId: profile.id,
      });
      navigate(`/messages/${res.data.conversationId}`);
    } catch (err) {
      console.error("❌ Room initialization failed:", err.message);
    }
  };

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
              innerCircle.map((user) => (
                <div key={user.uuid} className="connection-member">
                  <Link
                    to={`/profile/${user.uuid}`}
                    onClick={() => setIsDockOpen(false)}
                  >
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
            relationStatus === "active" || relationStatus === "pending"
              ? "disconnect"
              : "connect";
          toggleConnection(action);
        }}
        onMessageClick={handleMessageInitialization}
        author_profile_uuid={uuid}
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
