import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import DoveLogo from "../assets/dove-svgrepo-com.svg?react";

const AuthHome = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Smooth scroll handler
  const handleScroll = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-layout">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <DoveLogo className="nav-logo-img" />
          <span className="nav-logo-text">Pneuma</span>
        </div>

        <button 
          className={`hamburger ${isOpen ? "open" : ""}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <button className="nav-scroll-btn" onClick={() => handleScroll("mission")}>Our Mission</button>
          <button className="nav-scroll-btn" onClick={() => handleScroll("discover")}>Discover</button>
          <button className="nav-scroll-btn" onClick={() => handleScroll("contact")}>Contact</button>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <main className="hero-section">
        <header className="hero-content">
          <h1 className="hero-title">Koinonia</h1>
          <div className="glow-divider"></div>
          <p className="hero-subtitle">
            Document your daily journey with God and share the light you find along the way.
          </p>
          <blockquote className="hero-quote">
            "Your walk is a library of wisdom. Journal your wins, your struggles, 
            and your insights. Build your personal archive and let the world see 
            God's faithfulness through your story."
            <cite>— Pneuma</cite>
          </blockquote>
        </header>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate("/login")}>Come On In</button>
          <button className="btn btn-secondary" onClick={() => navigate("/register")}>Join Us</button>
        </div>
      </main>

      {/* ==================== EXTENDED SECTIONS ==================== */}
      <div className="extended-layout-wrapper">
        
        {/* DISCOVER SECTION */}
        <section id="discover" className="pneuma-sub-section discover-bg">
          <h2 className="section-main-heading">Discover Pneuma</h2>
          <div className="features-grid-system">
            
            <div className="feature-item-card">
              <div className="feature-emoji">📖</div>
              <h3>Sacred Altar</h3>
              <p>Write your raw prayers, deep insights, and quiet time interactions in a private sanctuary environment.</p>
            </div>

            <div className="feature-item-card">
              <div className="feature-emoji">🛡️</div>
              <h3>Controlled Exposure</h3>
              <p>Your workspace defaults to completely secure private storage. Choose exactly which entries you wish to reveal.</p>
            </div>

            <div className="feature-item-card">
              <div className="feature-emoji">🌱</div>
              <h3>Spiritual Archive</h3>
              <p>Map and log long-term tracking of answered prayers to create a personal archive of God's timing.</p>
            </div>

          </div>
        </section>

        {/* MISSION SECTION */}
        <section id="mission" className="pneuma-sub-section mission-bg">
          <div className="mission-inner-container">
            <h2 className="section-main-heading">Our Mission</h2>
            <p className="mission-descriptive-text">
              In a noisy digital environment built for distractions and validation loops, Pneuma is a quiet space. 
              We believe that every believer's walk holds personal realizations that shouldn't be lost to time. 
              Our mission is to help you track your walk, remember past victories, and pass down an unshakeable archive of faith.
            </p>
          </div>
        </section>

        {/* CONTACT / CTA SECTION */}
        <section id="contact" className="pneuma-sub-section contact-bg">
          <div className="action-cta-card">
            <h2>Ready to track your walk?</h2>
            <p>Create your space inside Pneuma today and begin mapping out your legacy.</p>
            <button className="btn btn-primary cta-action-btn" onClick={() => navigate("/register")}>
              Create Account
            </button>
            
            <div className="support-contact-footer">
              <span>Have inquiries or feedback? Write us directly at: </span>
              <a href="mailto:support@pneuma.com" className="email-hyperlink">support@pneuma.com</a>
            </div>
          </div>
        </section>

      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Pneuma | Every breath is a story.</p>
      </footer>
    </div>
  );
};

export default AuthHome;
