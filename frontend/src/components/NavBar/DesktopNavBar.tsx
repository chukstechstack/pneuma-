import React from "react";
import { Link } from "react-router-dom";
import doveLogoUrl from "@assets/pneuma.png";

interface DesktopNavBarProps {
  userUuid: string | null;
  pathname: string;
}

export const DesktopNavBar: React.FC<DesktopNavBarProps> = ({ userUuid, pathname }) => {
  const isActive = (path: string) => (pathname.startsWith(path) ? "nav-item active" : "nav-item");

  return (
    <nav className="desktop-master-nav">
      <div className="desktop-nav-inner-container">
        <div className="desktop-nav-left-wing">
          <Link to="/home" className="desktop-nav-brand-title">
            <span>
              <img src={doveLogoUrl} className="nav-logo-img" alt="Pneuma Logo" />
            </span>
            Pneuma
          </Link>
          <div className="desktop-search-input-box-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="desktop-search-svg-magnifier">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input id="desktop-search" name="desktop-search" type="text" placeholder="Search archive insights..." className="desktop-search-input-field" />
          </div>
        </div>

        <div className="desktop-nav-right-navigation-menu">
          <Link to="/home" className={`desktop-menu-item-anchor ${pathname === "/home" ? "active" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="menu-svg-vector-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="menu-anchor-text-label">Home</span>
          </Link>

          <Link to="/createtask" className="nav-item mobile-post-accent-btn" onTouchEnd={(e) => e.currentTarget.blur()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <line x1="12" x2="12" y1="8" y2="16" />
              <line x1="8" x2="16" y1="12" y2="12" />
            </svg>
            <span>Post</span>
          </Link>

          <Link to={`/journalfeed/${userUuid || "sanctuary"}`} className={isActive("/journalfeed")} onTouchEnd={(e) => e.currentTarget.blur()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10M6 10h10M6 14h10" />
            </svg>
            <span>Journal</span>
          </Link>

          <Link to="/messages" className={`desktop-menu-item-anchor ${pathname === "/messages" ? "active" : ""}`}>
            <div className="desktop-badge-relative-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="menu-svg-vector-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="desktop-badge-counter-flag notification-red">9</span>
            </div>
            <span className="menu-anchor-text-label">Messaging</span>
          </Link>

          <Link to="/notifications" className={`desktop-menu-item-anchor ${pathname === "/notifications" ? "active" : ""}`}>
            <div className="desktop-badge-relative-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="menu-svg-vector-icon">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="desktop-badge-counter-flag notification-gold">3</span>
            </div>
            <span className="menu-anchor-text-label">Alerts</span>
          </Link>

          <Link to="/profile" className={isActive("/profile")}>
            <div className="mobile-avatar-frame-bottom">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSysX8k1gABg8LHF0QSukobgjnwgnxqX1Pqjcxx6AafbTLSGRq8560Mz8I&s=10" className="mobile-avatar-img-bottom" alt="Me Profile" />
            </div>
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};