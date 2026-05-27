import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MessageSquare, Repeat2, Send } from "lucide-react";

const Task = ({
  task,
  deleteTask,
  isOwner,
  handleInteraction,
  handleFollow,
  currentUserUuid,
}) => {
  const {
    title,
    content,
    img,
    uuid,
    author_name,
    author_profile_uuid,
    is_following,
  } = task;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const textLimit = 123;
  const shouldShowMore = content.length > textLimit;

  return (
    <div className="taskInputCardBody">
      {/* ==================== 1. BRANDED HUB HEADER ==================== */}
      <div
        className="taskAvatarCardBody"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          className="taskHeaderLeft"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <img
            src={fallbackUserAvatar}
            alt="profile snippet"
            className="taskAvatarImage"
          />
          <div
            className="taskMetaBlock"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* 🧠 THE ALIGNMENT LAYERS: Smashes name and follow button on one line */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="taskAuthorName">
                {author_name || "Enlightened Luminary"}
              </div>

              {/* 🌟 THE FOLLOW BUTTON: Only shows if it is NOT your own post card! */}
              {currentUserUuid !== author_profile_uuid && (
                <button
                  onClick={() => handleFollow(author_profile_uuid)}
                  onTouchEnd={(e) => e.currentTarget.blur()}
                  onMouseLeave={(e) => e.currentTarget.blur()}
                  className={`taskFollowInlineButton ${is_following ? "following-active" : ""}`}
                >
                  {is_following ? "✓ Following" : "+ Follow"}
                </button>
              )}
            </div>

            <div className="taskCardTestimonyText">
              {title || "Spiritual Decree"} • May 20
            </div>
          </div>
        </div>

        {/* THREE DOT MANAGEMENT DROPDOWN */}
        {isOwner && (
          <div
            className="TaskDotMenuPosition"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
                    to={`/edittask/${uuid}`}
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
      <div className="postTextContent">
        <div>
          {!isExpanded && shouldShowMore
            ? `${content.substring(0, textLimit)}...`
            : content}

          {shouldShowMore && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              onTouchEnd={(e) => e.currentTarget.blur()}
              onMouseLeave={(e) => e.currentTarget.blur()}
              className="showMoreText"
            >
              expand
            </button>
          )}
        </div>
      </div>

      {/* ==================== 3. LUMINARY ACTION BAR ==================== */}
      <div className="taskActionButtonBar">
        <div className="action-buttons-left">
          {/* LIKE BUTTON */}
          <button
            onClick={() => handleInteraction(uuid, "like")}
            onTouchEnd={(e) => e.currentTarget.blur()}
            onMouseLeave={(e) => e.currentTarget.blur()}
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
            className="actionButton comment-btn"
            onTouchEnd={(e) => e.currentTarget.blur()}
            onMouseLeave={(e) => e.currentTarget.blur()}
          >
            <MessageSquare size={16} strokeWidth={2} />
            <span className="action-label">Reply</span>
            <span className="inline-action-counter">0</span>
          </button>

          {/* REPOST BUTTON */}
          <button
            onClick={() => handleInteraction(uuid, "repost")}
            onTouchEnd={(e) => e.currentTarget.blur()}
            onMouseLeave={(e) => e.currentTarget.blur()}
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
          <button
            className="actionButton send-btn"
            onTouchEnd={(e) => e.currentTarget.blur()}
            onMouseLeave={(e) => e.currentTarget.blur()}
          >
            <Send size={16} strokeWidth={2} />
            <span className="action-label">Send</span>
          </button>
        </div>
      </div>

      {/* ==================== 4. BLENDED GLOSSY MEDIA PORTAL ==================== */}
      {img && (
        <div className="taskImageWrapper">
          <img
            src={img}
            alt={title || "Luminary asset"}
            className="taskContentImageCard"
          />
        </div>
      )}
    </div>
  );
};

// Real safety placeholder image vector string to prevent file loading crashes
const fallbackUserAvatar =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20762%20762%22%20fill%3D%22none%22%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22381%22%20r%3D%22381%22%20fill%3D%22%231e2030%22%2F%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22300%22%20r%3D%22120%22%20fill%3D%22%238e92a2%22%2F%3E%3Cpath%20d%3D%22M181%20600c0-110%2090-200%20200-200s200%2090%20200%20200%22%20stroke%3D%22%238e92a2%22%20stroke-width%3D%2240%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E";

export default Task;
