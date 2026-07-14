import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Repeat2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import CommentDrawer from "./ComentDrawer";
import { useConnectionMutation } from "../hooks/useConnections.js";

const Task = ({
  task,
  deleteTask,
  isOwner,
  handle_Like_Reply_Share_Interaction,
  currentUserUuid,
  onEdit,
}) => {
  const {
    content,
    img,
    uuid,
    author_name,
    author_profile_uuid,
    relation_status,
    created_at,
    is_liked,
    is_reposted,
    likes_count,
    comments_count,
    reposts_count,
  } = task;

  const { mutate: toggleConnection } =
    useConnectionMutation(author_profile_uuid);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openDrawerId, setOpenDrawerId] = useState(
    localStorage.getItem("active_drawer") || null,
  );

  const textLimit = 123;
  const shouldShowMore = content?.length > textLimit;

  const formatTaskDate = (rawDateString) => {
    if (!rawDateString) return "May 20";
    const dateObj = new Date(rawDateString);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="pneuma-post-card-root">
      {/* ==================== 1. BRANDED HUB HEADER ==================== */}
      <div className="pneuma-post-header-row">
        <div className="pneuma-post-author-group">
          <Link to={`/profile/${author_profile_uuid}`}>
            <img
              src={fallbackUserAvatar}
              alt="profile"
              className="pneuma-post-avatar-element"
            />
          </Link>

          <div className="pneuma-post-meta-column">
            <div className="pneuma-post-author-name">
              {author_name || "Enlightened Luminary"}
            </div>
            <div className="pneuma-post-timestamp-row">
              <Calendar size={12} style={{ opacity: 0.7 }} />
              <span>{formatTaskDate(created_at)}</span>

              {currentUserUuid !== author_profile_uuid && (
                <button
                  onClick={() => {
                    const action =
                      relation_status === "active" ||
                      relation_status === "pending"
                        ? "disconnect"
                        : "connect";
                    toggleConnection(action);
                  }}
                  className={`taskFollowInlineButton ${
                    relation_status === "active"
                      ? "following-active"
                      : relation_status === "pending"
                        ? "following-requested"
                        : ""
                  }`}
                  style={{ margin: 0, padding: "2px 6px", fontSize: "11px" }}
                >
                  {relation_status === "active" && "UnConnect"}
                  {relation_status === "pending" && "Requested..."}
                  {(!relation_status || relation_status === "none") &&
                    "+ Connect"}
                </button>
              )}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="pneuma-post-dropdown-anchor">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="taskDotButton"
            >
              ⋮
            </button>
            {showMenu && (
              <>
                <div
                  className="menu-backdrop"
                  onClick={() => setShowMenu(false)}
                />
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
                  <button
                    onClick={() => deleteTask(uuid)}
                    className="menuDeleteButtonStyle"
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ==================== 2. DESCRIPTION ==================== */}
      <div className="pneuma-post-body-text">
        <div>
          {!isExpanded && shouldShowMore
            ? `${content.substring(0, textLimit)}...`
            : content}
          {shouldShowMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="showMoreText"
            >
              {isExpanded ? "Show Less" : "expand"}
            </button>
          )}
        </div>
      </div>

      {/* ==================== 3. ACTION BAR ==================== */}
      <div className="pneuma-post-action-dock">
        <div className="action-buttons-left">
          <button
            onClick={() => handle_Like_Reply_Share_Interaction(uuid, "like")}
            className={`actionButton like-btn ${is_liked ? "active" : ""}`}
          >
            <ThumbsUp
              size={16}
              strokeWidth={2}
              className={is_liked ? "icon-active" : ""}
            />
            <span className="action-label">Support</span>
            <span className="inline-action-counter">{likes_count || 0}</span>
          </button>

          <button
            onClick={() => {
              const nextState = openDrawerId === uuid ? null : uuid;
              setOpenDrawerId(nextState);
              nextState
                ? localStorage.setItem("active_drawer", uuid)
                : localStorage.removeItem("active_drawer");
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
            <Repeat2
              size={16}
              strokeWidth={2}
              className={is_reposted ? "icon-active" : ""}
            />
            <span className="action-label">Forward</span>
            <span className="inline-action-counter">{reposts_count || 0}</span>
          </button>
        </div>
      </div>

      {openDrawerId === uuid && (
        <CommentDrawer
          contentUuid={uuid}
          onClose={() => {
            setOpenDrawerId(null);
            localStorage.removeItem("active_drawer");
          }}
        />
      )}

      {img && (
        <div className="taskImageWrapper">
          <img src={img} alt="media" className="taskContentImageCard" />
        </div>
      )}
    </div>
  );
};

const fallbackUserAvatar =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20762%20762%22%20fill%3D%22none%22%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22381%22%20r%3D%22381%22%20fill%3D%22%231e2030%22%2F%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22300%22%20r%3D%22120%22%20fill%3D%22%238e92a2%22%2F%3E%3Cpath%20d%3D%22M181%20600c0-110%2090-200%20200-200s200%2090%20200%20200%22%20stroke%3D%22%238e92a2%22%20stroke-width%3D%2240%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E";

export default Task;
