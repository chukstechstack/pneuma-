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
      {/* ==================== 1. BRANDED HUB HEADER ==================== */}
      <div className="taskAvatarCardBody" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="taskHeaderLeft" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="data:image/jpeg;base64,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"
            alt="profile"
            className="taskAvatarImage"
          />
          <div className="taskMetaBlock" style={{ display: "flex", flexDirection: "column" }}>
            <div className="taskAuthorName">
              {author_name || "Enlightened Luminary"}
            </div>
            <div className="taskCardTestimonyText">Spiritual Decree • May 20</div>
          </div>
        </div>

        {/* THREE DOT MANAGEMENT DROPDOWN */}
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
                <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
                <div className="dotMenuDisplay">
                  <Link to={`/edittask/${uuid}`} className="menuEditButtonStyle">
                    Amend Chronicle
                  </Link>
                  <button onClick={() => deleteTask(uuid)} className="menuDeleteButtonStyle">
                    Evaporate Trace
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
          {!isExpanded && shouldShowMore ? `${content.substring(0, textLimit)}...` : content}
          
          {shouldShowMore && !isExpanded && (
            <button onClick={() => setIsExpanded(true)} className="showMoreText">
              expand
            </button>
          )}
        </div>
      </div>

      {/* ==================== 3. LUMINARY ACTION BAR ==================== */}
      <div className="taskActionButtonBar">
        <div className="action-buttons-left">
          <button className="actionButton">
            <ThumbsUp size={16} strokeWidth={2} />
            <span className="action-label">Resonate</span>
            <span className="inline-action-counter">24</span>
          </button>

          <button className="actionButton">
            <MessageSquare size={16} strokeWidth={2} />
            <span className="action-label">Echo</span>
            <span className="inline-action-counter">8</span>
          </button>

          <button className="actionButton">
            <Repeat2 size={16} strokeWidth={2} />
            <span className="action-label">Transmit</span>
            <span className="inline-action-counter">3</span>
          </button>

          <button className="actionButton">
            <Send size={16} strokeWidth={2} />
            <span className="action-label">Propagate</span>
          </button>
        </div>
      </div>

      {/* ==================== 4. BLENDED GLOSSY MEDIA PORTAL ==================== */}
      {img && (
        <div className="taskImageWrapper">
          <img src={img} alt={title || "Luminary asset"} className="taskContentImageCard" />
        </div>
      )}
    </div>
  );
};

export default Task;
