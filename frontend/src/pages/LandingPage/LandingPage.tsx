import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@styles/Landing.css";
import doveLogoUrl from "../assets/pneuma.png";

interface AuthHomeProps {}

type TimerId = number;

const LandingPage: React.FC<AuthHomeProps> = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTitleAwake, setIsTitleAwake] = useState<boolean>(false);
  const [isLitOnFire, setIsLitOnFire] = useState<boolean>(false);
  const [isNavAwake, setIsNavAwake] = useState<boolean>(false);

  useEffect(() => {
    const titleTimer: TimerId = window.setTimeout(() => {
      setIsTitleAwake(true);
    }, 200);
    const fireTimer: TimerId = window.setTimeout(() => {
      setIsLitOnFire(true);
    }, 1100);
    const navTimer: TimerId = window.setTimeout(() => {
      setIsNavAwake(true);
    }, 3100);
    const coolTimer: TimerId = window.setTimeout(() => {
      setIsLitOnFire(false);
    }, 4800);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(fireTimer);
      clearTimeout(navTimer);
      clearTimeout(coolTimer);
    };
  }, []);

  interface ScrollHandler {
    (id: string): void;
  }

  const handleScroll: ScrollHandler = (id: string) => {
    setIsOpen(false);
    const element: HTMLElement | null = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="cosmic-particle-void">
      <div className={`quantum-dust-field ${isTitleAwake ? "spark-one" : ""}`}>
        {[...Array(60)].map((_, i) => (
          <div key={i} className={`dust-speck speck-${i}`}></div>
        ))}
      </div>
      <nav className={`navbar-void-cosmic ${isNavAwake ? "awake" : ""}`}>
        <div
          className="nav-logo-cosmic"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={doveLogoUrl}
            className="logo-cosmic-glow"
            alt="Pneuma Logo"
          />
          <span className="logo-text-formed">Pneuma</span>
        </div>

        <button
          className={`hamburger-cosmic ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar-cosmic"></span>
          <span className="bar-cosmic"></span>
        </button>

        <div className={`nav-links-cosmic ${isOpen ? "active" : ""}`}>
          <button
            className="cosmic-nav-btn"
            onClick={() => handleScroll("sanctuary")}
          >
            The Core
          </button>
          <button
            className="cosmic-nav-btn"
            onClick={() => handleScroll("archive-gate")}
          >
            Contact
          </button>
        </div>
      </nav>
      <main className="cosmic-hero-stage">
        <header className="hero-reconstruction-core">
          <h1
            className={`particle-formed-title ${isLitOnFire ? "on-fire" : ""}`}
          >
            {isTitleAwake && (
              <span className="kinetic-alignment-core">
                <span className="slide-left-wing">KOI</span>
                <span className="slide-right-wing">NONIA</span>
              </span>
            )}
          </h1>

          <div
            className={`interface-cascade-wrapper ${isNavAwake ? "awake" : ""}`}
          >
            <div className="cosmic-laser-divider"></div>
            <p className="cosmic-subtitle">
              Document your daily journey with God and share the light you find
              along the way.
            </p>
            <blockquote className="cosmic-quote">
              "Your walk is a library of wisdom. Journal your wins, your
              struggles, and your insights. Build your personal archive."
              <cite>— Pneuma</cite>
            </blockquote>
          </div>
        </header>

        <div className={`cosmic-actions ${isNavAwake ? "awake" : ""}`}>
          <button
            className="btn-cosmic-filament primary-filament"
            onClick={() => navigate("/login")}
          >
            Come On In
          </button>
          <button
            className="btn-cosmic-filament secondary-filament"
            onClick={() => navigate("/register")}
          >
            Join Us
          </button>
        </div>
      </main>

      <div className="unbound-cosmic-wrapper">
        <section id="sanctuary" className="cosmic-sub-section">
          <div className="reveal-on-scroll-card">
            <h2 className="reveal-heading">THE SACRED ARCHIVE</h2>
            <p className="reveal-text">
              The stardust settles. No bulky circles, no cheesy squares. Just a
              pure dark canvas where the light bends around your entries. As you
              scroll, reality drifts upward safely.
            </p>
          </div>
        </section>

        <section id="archive-gate" className="cosmic-sub-section">
          <div className="cosmic-cta-gate">
            <h2>ENTER THE PNEUMA</h2>
            <p>
              Begin tracking your personal history of faith inside a silent
              digital sanctuary.
            </p>
            <button
              className="btn-cosmic-filament primary-filament"
              onClick={() => navigate("/register")}
            >
              LAUNCH LOG
            </button>
            <div className="cosmic-directory-footer">
              <span>METASYSTEM ENCRYPT: </span>
              <a href="mailto:support@pneuma.com" className="cosmic-hyperlink">
                support@pneuma.com
              </a>
            </div>
          </div>
        </section>
      </div>

      <footer className="cosmic-footer">
        <p>
          © {new Date().getFullYear()} Pneuma // EVERY BREATH IS A METRIC OF
          GRACE.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
