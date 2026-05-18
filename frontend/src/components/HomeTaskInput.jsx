import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import { ThumbsUp, MessageSquare, Repeat2, Send } from "lucide-react";

const Task = ({ task, deleteTask, isOwner }) => {
  const { title, content, img, uuid, author_name } = task;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const textLimit = 123;
  const shouldShowMore = content.length > textLimit;

  return (
    <div className="taskInputCardBody">
      {/* ==================== 1. TOP AUTHOR HEADER ==================== */}
      <div
        className="taskAvatarCardBody"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          className="taskAvatarcardBackground"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <img
            src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Frobohash.org%2Fmail%40ashallendesign.co.uk"
            alt="profile"
            className="taskAvatarImage"
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="taskAuthorName">
              {author_name || "Unknown User"}
            </div>
            <div className="taskCardTestimonyText">Testimony</div>
          </div>
        </div>

        {/* THREE DOT MANAGEMENT DRAWER MENU */}
        {isOwner && (
          <div className="TaskDotMenuPosition" style={{ position: "relative" }}>
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
                    Edit Post
                  </Link>
                  <button
                    onClick={() => deleteTask(uuid)}
                    className="menuDeleteButtonStyle"
                  >
                    Delete Post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ==================== 2. POST CONTENT BODY ==================== */}
      <div className="postTextContent">
        <div className={!isExpanded && shouldShowMore ? "clamp-wrapper" : ""}>
          {content}
        </div>

        {shouldShowMore && !isExpanded && (
          <button onClick={() => setIsExpanded(true)} className="showMoreText">
            ... see more
          </button>
        )}
      </div>

      {/* ==================== 3. MEDIA IMAGE SEGMENT ==================== */}
      {img && (
        <div className="taskImageWrapper">
          <img src={img} alt={title} className="taskContentImageCard" />
        </div>
      )}

      {/* ==================== 4. SYNCED TIMELINE ACTION BAR ==================== */}
      <div className="taskActionButtonBar">
        <div className="action-buttons-left">
          {/* Like Button (Now matching the exact structure of Comment and Repost) */}
          <button className="actionButton">
            <ThumbsUp size={18} strokeWidth={1.5} />
            <span className="action-label">Like</span>
            <span className="inline-action-counter">24</span>
          </button>

          {/* Comment Button */}
          <button className="actionButton">
            <MessageSquare size={18} strokeWidth={1.5} />
            <span className="action-label">Comment</span>
            <span className="inline-action-counter">8</span>
          </button>

          {/* Repost Button */}
          <button className="actionButton">
            <Repeat2 size={18} strokeWidth={1.5} />
            <span className="action-label">Repost</span>
            <span className="inline-action-counter">3</span>
          </button>

          {/* Send Button */}
          <button className="actionButton">
            <Send size={18} strokeWidth={1.5} />
            <span className="action-label">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;
