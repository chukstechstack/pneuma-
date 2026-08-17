import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Repeat2 } from "lucide-react";

interface TaskActionsProps {
  uuid: string;
  is_liked?: boolean;
  is_reposted?: boolean;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  handle_Like_Reply_Share_Interaction: (uuid: string, action: string) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  uuid,
  is_liked,
  is_reposted,
  likes_count,
  comments_count,
  reposts_count,
  handle_Like_Reply_Share_Interaction,
}) => {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(
    (localStorage.getItem("active_drawer") as string) || null,
  );

  return (
    <>
      <div className="pneuma-post-action-dock">
        <div className="action-buttons-left">
          <button
            onClick={() => handle_Like_Reply_Share_Interaction(uuid, "like")}
            className={`actionButton like-btn ${is_liked ? "active" : ""}`}
          >
            <ThumbsUp size={16} strokeWidth={2} className={is_liked ? "icon-active" : ""} />
            <span className="action-label">Support</span>
            <span className="inline-action-counter">{likes_count || 0}</span>
          </button>

          <button
            onClick={() => {
              const nextState = openDrawerId === uuid ? null : uuid;
              setOpenDrawerId(nextState);
              nextState ? localStorage.setItem("active_drawer", uuid) : localStorage.removeItem("active_drawer");
            }}
            className="actionButton comment-btn"
          >
            <MessageSquare size={16} strokeWidth={2} />
            <span className="action-label">Reply</span>
            <span className="inline-action-counter">{comments_count || 0}</span>
          </button>

          <button
            onClick={() => handle_Like_Reply_Share_Interaction(uuid, "repost")}
            className={`actionButton repost-btn ${is_reposted ? "active" : ""}`}
          >
            <Repeat2 size={16} strokeWidth={2} className={is_reposted ? "icon-active" : ""} />
            <span className="action-label">Re-Send</span>
            <span className="inline-action-counter">{reposts_count || 0}</span>
          </button>
        </div>
      </div>
    </>
  );
};