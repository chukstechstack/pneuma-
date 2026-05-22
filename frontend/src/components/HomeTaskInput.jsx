import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MessageSquare, Repeat2, Send } from "lucide-react";

const Task = ({ task, deleteTask, isOwner }) => {
  const { title, content, img, uuid, author_name } = task;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const textLimit = 123;
  const shouldShowMore = content.length > textLimit;

  // Real placeholder image link to prevent loading failures
  const fallbackUserAvatar = "https://unsplash.com";

  return (
    <div className="taskInputCardBody">
      {/* ==================== 1. BRANDED HUB HEADER ==================== */}
      {/* Inline styles force perfect alignment line across all mobile devices */}
      <div 
        className="taskAvatarCardBody" 
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}
      >
        <div className="taskHeaderLeft" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={fallbackUserAvatar}
            alt="profile snippet"
            className="taskAvatarImage"
          />
          <div className="taskMetaBlock" style={{ display: "flex", flexDirection: "column" }}>
            <div className="taskAuthorName">
              {author_name || "Enlightened Luminary"}
            </div>
            <div className="taskCardTestimonyText">{title || "Spiritual Decree"} • May 20</div>
          </div>
        </div>

        {/* THREE DOT MANAGEMENT DROPDOWN */}
        {isOwner && (
          /* Inline alignment locks the dots container directly onto the vertical center point */
          <div 
            className="TaskDotMenuPosition" 
            style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <button onClick={() => setShowMenu(!showMenu)} className="taskDotButton">
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
          <button className="actionButton like-btn">
            <ThumbsUp size={16} strokeWidth={2} />
            <span className="action-label">Resonate</span>
            <span className="inline-action-counter">24</span>
          </button>

          <button className="actionButton comment-btn">
            <MessageSquare size={16} strokeWidth={2} />
            <span className="action-label">Echo</span>
            <span className="inline-action-counter">8</span>
          </button>

          <button className="actionButton repost-btn">
            <Repeat2 size={16} strokeWidth={2} />
            <span className="action-label">Transmit</span>
            <span className="inline-action-counter">3</span>
          </button>

          <button className="actionButton send-btn">
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
