import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useConnectionMutation } from "@hooks/useConnections.js";

interface TaskHeaderProps {
  task: {
    uuid: string;
    author_name?: string | null;
    author_profile_uuid: string;
    relation_status?: string | null;
    created_at?: string | null;
  };
  isOwner: boolean;
  currentUserUuid: string;
  onEdit: (uuid: string) => void;
  deleteTask: (uuid: string) => void;
  fallbackUserAvatar: string;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  isOwner,
  currentUserUuid,
  onEdit,
  deleteTask,
  fallbackUserAvatar,
}) => {
  const { uuid, author_name, author_profile_uuid, relation_status, created_at } = task;
  const { mutate: toggleConnection } = useConnectionMutation(author_profile_uuid);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const formatTaskDate = (rawDateString: string | null | undefined): string => {
    if (!rawDateString) return "May 20";
    const dateObj: Date = new Date(rawDateString);
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="pneuma-post-header-row">
      <div className="pneuma-post-author-group">
        <Link to={`/profile/${author_profile_uuid}`}>
          <img src={fallbackUserAvatar} alt="profile" className="pneuma-post-avatar-element" />
        </Link>

        <div className="pneuma-post-meta-column">
          <div className="pneuma-post-author-name">{author_name || "Enlightened Luminary"}</div>
          <div className="pneuma-post-timestamp-row">
            <Calendar size={12} style={{ opacity: 0.7 }} />
            <span>{formatTaskDate(created_at)}</span>

            {currentUserUuid !== author_profile_uuid && (
              <button
                onClick={() => {
                  const action = relation_status === "active" || relation_status === "pending" ? "disconnect" : "connect";
                  toggleConnection(action as unknown as any);
                }}
                className={`taskFollowInlineButton ${
                  relation_status === "active" ? "following-active" : relation_status === "pending" ? "following-requested" : ""
                }`}
                style={{ margin: 0, padding: "2px 6px", fontSize: "11px" }}
              >
                {relation_status === "active" && "UnConnect"}
                {relation_status === "pending" && "Requested..."}
                {(!relation_status || relation_status === "none") && "+ Connect"}
              </button>
            )}
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="pneuma-post-dropdown-anchor">
          <button onClick={() => setShowMenu(!showMenu)} className="taskDotButton">
            ⋮
          </button>
          {showMenu && (
            <>
              <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
              <div className="dotMenuDisplay">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(uuid);
                  }}
                  className="menuEditButtonStyle"
                >
                  Modify
                </button>
                <button onClick={() => deleteTask(uuid)} className="menuDeleteButtonStyle">
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};