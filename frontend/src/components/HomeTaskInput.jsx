import React, { useState, useContext } from "react";
import TaskContext from "../context/TaskContext.jsx";
import { ThumbsUp, MessageSquare, Repeat2, Send, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import CommentDrawer from "./ComentDrawer";

const Task = ({
  task,
  deleteTask,
  isOwner,
  handleInteraction,
  handleFollow,
  currentUserUuid,
}) => {
  const {
    content,
    img,
    uuid,
    author_name,
    author_profile_uuid,
    relation_status,
    created_at,
  } = task;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const textLimit = 123;
  const shouldShowMore = content?.length > textLimit;

  // 🎯 FIXED STARTING STATE: Looks into browser memory. If empty, defaults to null.
  const [openDrawerId, setOpenDrawerId] = useState(
    localStorage.getItem("active_drawer") || null,
  );
  const { followStates } = useContext(TaskContext);
  // Calculate if this specific card should show pending, active, or null
  let cardActiveRelationStatus;

  if (followStates[author_profile_uuid] !== undefined) {
    cardActiveRelationStatus = followStates[author_profile_uuid];
  } else {
    cardActiveRelationStatus = relation_status;
  }

  // 🧠 DATE FORMATTER ENGINE
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
              alt="profile snippet"
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
                  onClick={() => handleFollow(author_profile_uuid)}
                  className={`taskFollowInlineButton ${
                    cardActiveRelationStatus === "active"
                      ? "following-active"
                      : cardActiveRelationStatus === "pending"
                        ? "following-requested"
                        : ""
                  }`}
                  style={{ margin: 0, padding: "2px 6px", fontSize: "11px" }}
                >
                  {cardActiveRelationStatus === "active" && "✓ Following"}
                  {cardActiveRelationStatus === "pending" && "Requested..."}
                  {cardActiveRelationStatus === null && "+ Follow"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* THREE DOT MANAGEMENT DROPDOWN */}
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
                  <Link
                    to={`/patchfeed/${uuid}`}
                    className="menuEditButtonStyle"
                  >
                    Modify
                  </Link>
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

      {/* ==================== 2. DESCRIPTION INSIGHT TEXT ==================== */}
      <div className="pneuma-post-body-text">
        <div>
          {!isExpanded && shouldShowMore
            ? `${content.substring(0, textLimit)}...`
            : content}

          {shouldShowMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ marginLeft: "6px", cursor: "pointer" }}
              className="showMoreText"
            >
              {isExpanded ? "Show Less" : "expand"}
            </button>
          )}
        </div>
      </div>

      {/* ==================== 3. LUMINARY ACTION BAR ==================== */}
      <div className="pneuma-post-action-dock">
        <div className="action-buttons-left">
          {/* LIKE BUTTON */}
          <button
            onClick={() => handleInteraction(uuid, "like")}
            className={`actionButton like-btn ${task.is_liked ? "active" : ""}`}
          >
            <ThumbsUp
              size={16}
              strokeWidth={2}
              className={task.is_liked ? "icon-active" : ""}
            />
            <span className="action-label">Support</span>
            <span className="inline-action-counter">
              {task.likes_count || 0}
            </span>
          </button>

          {/* COMMENT BUTTON */}
          <button
            onClick={() => {
              // Calculate next state step
              const nextState = openDrawerId === uuid ? null : uuid;
              setOpenDrawerId(nextState);

              // 🎯 FIXED SHORTCUT: Save to browser memory if opening, clear if closing
              if (nextState) {
                localStorage.setItem("active_drawer", uuid);
              } else {
                localStorage.removeItem("active_drawer");
              }
            }}
            className="actionButton comment-btn"
          >
            <MessageSquare size={16} strokeWidth={2} />
            <span className="action-label">Reply</span>
            <span className="inline-action-counter">
              {task.comments_count || 0}
            </span>
          </button>

          {/* REPOST BUTTON */}
          <button
            onClick={() => handleInteraction(uuid, "repost")}
            className={`actionButton repost-btn ${task.is_reposted ? "active" : ""}`}
          >
            <Repeat2
              size={16}
              strokeWidth={2}
              className={task.is_reposted ? "icon-active" : ""}
            />
            <span className="action-label">Forward</span>
            <span className="inline-action-counter">
              {task.reposts_count || 0}
            </span>
          </button>

          {/* SEND BUTTON */}
          <button className="actionButton send-btn">
            <Send size={16} strokeWidth={2} />
            <span className="action-label">Send</span>
          </button>
        </div>
      </div>
      {/* COMMENT DRAWER CONTAINER */}
      {openDrawerId === uuid && (
        <CommentDrawer
          contentUuid={uuid}
          onClose={() => {
            // 🎯 FIXED SHORTCUT: Clear state and browser memory at the same time
            setOpenDrawerId(null);
            localStorage.removeItem("active_drawer");
          }}
        />
      )}
      {/* ==================== 4. BLENDED GLOSSY MEDIA PORTAL ==================== */}
      {img && (
        <div className="taskImageWrapper">
          <img
            src={img}
            alt="Luminary asset"
            className="taskContentImageCard"
          />
        </div>
      )}
    </div>
  );
};

const fallbackUserAvatar =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20762%20762%22%20fill%3D%22none%22%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22381%22%20r%3D%22381%22%20fill%3D%22%231e2030%22%2F%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22300%22%20r%3D%22120%22%20fill%3D%22%238e92a2%22%2F%3E%3Cpath%20d%3D%22M181%20600c0-110%2090-200%20200-200s200%2090%20200%20200%22%20stroke%3D%22%238e92a2%22%20stroke-width%3D%2240%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E";

export default Task;
