import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../styles/NavBar.css";
import doveLogoUrl from "../assets/pneuma.png";

const NavBar = ({ currentUserUuid }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Checks if the user is currently on the home or journal paths to highlight tabs
  const isActive = (path) =>
    location.pathname.startsWith(path) ? "nav-item active" : "nav-item";

  const mobileProfilePic = "https://dev.to";

  // 🚀 OPTIMIZED LINKEDIN SCROLL ENGINE
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      if (currentScrollY < 20) {
        setIsVisible(true);
      } else if (scrollDifference > 8) {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false); // Scrolling down
        } else {
          setIsVisible(true); // Scrolling up
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
          paddingLeft:  "16px" /* 🛡️ SAFETY GATE: Keeps search away from left glass edge */,
          paddingRight: "16px" /* 🛡️ SAFETY GATE: Pulls message icon safely inside right glass edge */,
          boxSizing:"border-box" /* Prevents padding from causing horizontal overflow bugs */,
        }}
      >
        {/* LEFT CONTAINER */}
        <div className="mobile-nav-left" style={{ flexGrow: 1 }}>
          <div className="mobile-search-trigger-bar" style={{ width: "100%" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="search-mini-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span>Search archive insights...</span>
          </div>
        </div>

        {/* RIGHT CONTAINER */}
        <Link
          to="/messages"
          className="mobile-nav-badge-icon"
          onTouchEnd={(e) => e.currentTarget.blur()}
          style={{
            marginLeft:
              "16px" /* 🚀 REPLACED 'AUTO': Creates a firm, safe gap right after search bar */,
            display: "flex",
            alignItems: "center",
            flexShrink: 0 /* Prevents the icon from squishing on tiny devices */,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="badge-counter-alert counter-red">9</span>
        </Link>
      </nav>
      {/* ==================== 2. MOBILE BOTTOM FIXED NAVIGATION ==================== */}
      <nav className={`mobile-bottom-nav ${!isVisible ? "nav-hidden" : ""}`}>
        {/* TAB 1: HOME */}
        <Link
          to="/home"
          className={isActive("/home")}
          onTouchEnd={(e) => e.currentTarget.blur()}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </Link>

        {/* TAB 2: MY PERSONAL JOURNAL (Mapped directly to your dynamic router path!) */}
        <Link
          to={`/journalfeed/${currentUserUuid || "sanctuary"}`}
          className={isActive("/journalfeed")}
          onTouchEnd={(e) => e.currentTarget.blur()}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10M6 10h10M6 14h10" />
          </svg>
          <span>Journal</span>
        </Link>

        {/* TAB 3: POST ACCENT BUTTON (Perfectly Centered) */}
        <Link
          to="/createtask"
          className="nav-item mobile-post-accent-btn"
          onTouchEnd={(e) => e.currentTarget.blur()}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <line x1="12" x2="12" y1="8" y2="16" />
            <line x1="8" x2="16" y1="12" y2="12" />
          </svg>
          <span>Post</span>
        </Link>

        {/* TAB 4: ALERTS / NOTIFICATIONS */}
        <Link
          to="/notifications"
          className={isActive("/notifications")}
          onTouchEnd={(e) => e.currentTarget.blur()}
        >
          <div className="mobile-badge-container-wrapper">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="badge-counter-alert">3</span>
          </div>
          <span>Alerts</span>
        </Link>

        {/* TAB 5: PROFILE PICTURE LINK */}
        <Link to="/profile" className={isActive("/profile")}>
          <div className="mobile-avatar-frame-bottom">
            <img
              src={mobileProfilePic}
              className="mobile-avatar-img-bottom"
              alt="Me Profile"
            />
          </div>
          <span>Profile</span>
        </Link>
      </nav>
      {/* ==================== 3. DESKTOP GLASS HEADER BAR ==================== */}
      <nav className="desktop-master-nav">
        <div className="desktop-nav-inner-container">
          <div className="desktop-nav-left-wing">
            <Link to="/home" className="desktop-nav-brand-title">
              <span>
                <img
                  src={doveLogoUrl}
                  className="nav-logo-img"
                  alt="Pneuma Logo"
                />
              </span>
              Pneuma
            </Link>
            <div className="desktop-search-input-box-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="desktop-search-svg-magnifier"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                id="desktop-search"
                name="desktop-search"
                type="text"
                placeholder="Search archive insights..."
                className="desktop-search-input-field"
              />
            </div>
          </div>

          <div className="desktop-nav-right-navigation-menu">
            <Link
              to="/home"
              className={`desktop-menu-item-anchor ${location.pathname === "/home" ? "active" : ""}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="menu-svg-vector-icon"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="menu-anchor-text-label">Home</span>
            </Link>

            <Link
              to="/messages"
              className={`desktop-menu-item-anchor ${location.pathname === "/messages" ? "active" : ""}`}
            >
              <div className="desktop-badge-relative-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="menu-svg-vector-icon"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="desktop-badge-counter-flag notification-red">
                  9
                </span>
              </div>
              <span className="menu-anchor-text-label">Messaging</span>
            </Link>

            <Link
              to="/notifications"
              className={`desktop-menu-item-anchor ${location.pathname === "/notifications" ? "active" : ""}`}
            >
              <div className="desktop-badge-relative-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="menu-svg-vector-icon"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="desktop-badge-counter-flag notification-gold">
                  3
                </span>
              </div>
              <span className="menu-anchor-text-label">Notifications</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
