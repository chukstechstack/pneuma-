import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import "../styles/LandingSections.css"; // Isolated CSS for the new sections
import DoveLogo from "../assets/dove-svgrepo-com.svg?react";
import LandingSections from "./LandingSections.jsx"; // Imported separate file

const AuthHome = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Smooth scrolls down to the custom container sections
  const handleScroll = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <DoveLogo className="nav-logo-img" />
          <span className="nav-logo"> Pneuma </span>
        </div>

        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? "bar open" : "bar"}></span>
          <span className={isOpen ? "bar open" : "bar"}></span>
          <span className={isOpen ? "bar open" : "bar"}></span>
        </div>

        {/* Links now act as triggers for the smooth scroll engine */}
        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <button className="nav-scroll-btn" onClick={() => handleScroll("mission")}>
            Our Mission
          </button>
          <button className="nav-scroll-btn" onClick={() => handleScroll("discover")}>
            Discover
          </button>
          <button className="nav-scroll-btn" onClick={() => handleScroll("contact")}>
            Contact
          </button>
        </div>
      </nav>

      <div className="body">
        <div className="testimony-heading">
          <p id="testimony-head"> Pneuma</p>
          <div className="dividing-line"></div>
          <p id="testimony-subhead">
            Document your daily journey with God and share the light you find
            along the way.
          </p>
          <p className="app-description">
            "Your walk is a library of wisdom. Journal your wins, your struggles,
            and your insights. Build your personal archive and let the world see
            God's faithfulness through your story."— Pneuma
          </p>
        </div>

        <div className="button">
          <button onClick={() => navigate("/login")}> Come On In</button>
          <button onClick={() => navigate("/register")}> Join Us</button>
        </div>
      </div>

      {/* Renders your sub-sections right beneath the main face container */}
      <LandingSections navigate={navigate} />

      <footer className="footer">
        <p>© {new Date().getFullYear()} Pneuma | Every breath is a story.</p>
      </footer>
    </div>
  );
};

export default AuthHome;
