import React from "react";
import { Link } from "react-router-dom";

interface MobileNavBarProps {
  isVisible: boolean;
  userUuid: string | null;
  pathname: string;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ isVisible, userUuid, pathname }) => {
  const isActive = (path: string) => (pathname.startsWith(path) ? "nav-item active" : "nav-item");

  return (
    <>
      {/* ==================== 1. MOBILE TOP ACTION BAR ==================== */}
      <nav
        className={`mobile-top-nav ${!isVisible ? "nav-hidden" : ""}`}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingLeft: "16px",
          paddingRight: "16px",
          boxSizing: "border-box",
        }}
      >
        <div className="mobile-nav-left" style={{ flexGrow: 1 }}>
          <div className="mobile-search-trigger-bar" style={{ width: "100%" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-mini-icon">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span>Search archive insights...</span>
          </div>
        </div>

        <Link
          to="/messages"
          className="mobile-nav-badge-icon"
          onTouchEnd={(e) => e.currentTarget.blur()}
          style={{ marginLeft: "16px", display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="badge-counter-alert counter-red">9</span>
        </Link>
      </nav>

      {/* ==================== 2. MOBILE BOTTOM FIXED NAVIGATION ==================== */}
      <nav className={`mobile-bottom-nav ${!isVisible ? "nav-hidden" : ""}`}>
        <Link to="/home" className={isActive("/home")} onTouchEnd={(e) => e.currentTarget.blur()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </Link>

        <Link to={`/journalfeed/${userUuid || "sanctuary"}`} className={isActive("/journalfeed")} onTouchEnd={(e) => e.currentTarget.blur()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10M6 10h10M6 14h10" />
          </svg>
          <span>Journal</span>
        </Link>

        <Link to="/createtask" className="nav-item mobile-post-accent-btn" onTouchEnd={(e) => e.currentTarget.blur()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <line x1="12" x2="12" y1="8" y2="16" />
            <line x1="8" x2="16" y1="12" y2="12" />
          </svg>
          <span>Post</span>
        </Link>

        <Link to="/notifications" className={isActive("/notificationspage")} onTouchEnd={(e) => e.currentTarget.blur()}>
          <div className="mobile-badge-container-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </div>
          <span>Alerts</span>
        </Link>

        <Link to="/profile" className={isActive("/profile")}>
          <div className="mobile-avatar-frame-bottom">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSysX8k1gABg8LHF0QSukobgjnwgnxqX1Pqjcxx6AafbTLSGRq8560Mz8I&s=10" className="mobile-avatar-img-bottom" alt="Me Profile" />
          </div>
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
};