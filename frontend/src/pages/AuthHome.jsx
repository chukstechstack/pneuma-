import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../styles/Login.css";
import DoveLogo from "../assets/dove-svgrepo-com.svg?react";

const AuthHome = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <nav className="navbar">
        <div className="nav-logo">
          <DoveLogo className="nav-logo-img" />
          <span className="nav-logo"> Pnuma </span>
        </div>
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? "bar open" : "bar"}></span>
          <span className={isOpen ? "bar open" : "bar"}></span>
          <span className={isOpen ? "bar open" : "bar"}></span>
        </div>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <NavLink to="/mission" onClick={() => setIsOpen(false)}>
            {" "}
            Our Mission{" "}
          </NavLink>
          <NavLink to="/discover" onClick={() => setIsOpen(false)}>
            {" "}
            Discover
          </NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)}>
            {" "}
            Contact{" "}
          </NavLink>
        </div>
      </nav>
      <div className="body">
        <div className="testimony-heading">
          <p id="testimony-head"> Pneuma</p>
          <div className="dividing-line"></div>
          <p id="testimony-subhead">
            Breathing life into every testimony you share here
          </p>
          <p className="app-description">
            "Join our community of believers & share your testimony with us.
            connect, register and start sharing your journey with the world."—
            Pnuma
          </p>
        </div>
        <div className="button">
          <button onClick={() => navigate("/auth/login")}> Login</button>
          <button onClick={() => navigate("/auth/register")}> Register</button>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Pnuma | Every breath is a story.</p>
      </footer>
    </div>
  );
};
export default AuthHome;
