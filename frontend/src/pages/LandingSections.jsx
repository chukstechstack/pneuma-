import React from "react";

const LandingSections = ({ navigate }) => {
  return (
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
          <button className="cta-action-btn" onClick={() => navigate("/register")}>
            Create Account
          </button>
          
          <div className="support-contact-footer">
            <span>Have inquiries or feedback? Write us directly at: </span>
            <a href="mailto:support@pneuma.com" className="email-hyperlink">support@pneuma.com</a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingSections;
