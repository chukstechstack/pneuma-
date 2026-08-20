import { useState, useEffect } from "react";

export function useScrollMessage() {
  const [scrollMsg, setScrollMsg] = useState("Viewing the abyss... 🌌");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = scrollPos / docHeight;

      if (progress < 0.15) {
        setScrollMsg("Viewing the abyss... 🌌");
      } else if (progress < 0.3) {
        setScrollMsg("Chapter 02: Unlocking core architecture... ⚡");
      } else if (progress < 0.5) {
        setScrollMsg("Rural collapse detected 🏚️ (Spooky)");
      } else if (progress < 0.7) {
        setScrollMsg("Breaking chains... or just avoiding work? 🤔");
      } else if (progress < 0.9) {
        setScrollMsg("Emergency vibes unlocked 🚨");
      } else {
        setScrollMsg("Bro you actually read all this? Legend 🏆");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollMsg;
}