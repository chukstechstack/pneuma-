import React, { useState, useEffect } from "react";
import { Navigation } from "./Component/Navigation"
import { ScrollBadge } from "./Component/ScrollBadge";
import { HeroSection } from "./Component/HeroSection";
import { ChapterTwoSection } from "./Component/ChapterTwoSection";
import { OutpostsSection } from "./Component/OutpostsSection";
import { ChronicleSection } from "./Component/ChronicleSection";
import { TriageSection } from "./Component/TriageSection";
import { ArchivesSection } from "./Component/ArchivesSection";

export const LandingPage: React.FC = () => {
  const [scrollMsg, setScrollMsg] = useState("Viewing the abyss... 🌌");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = scrollPos / docHeight;

      if (progress < 0.15) setScrollMsg("Viewing the abyss... 🌌");
      else if (progress < 0.3) setScrollMsg("Chapter 02: Unlocking core architecture... ⚡");
      else if (progress < 0.5) setScrollMsg("Rural collapse detected 🏚️");
      else if (progress < 0.7) setScrollMsg("Breaking chains... 🤔");
      else if (progress < 0.9) setScrollMsg("Emergency vibes unlocked 🚨");
      else setScrollMsg("Bro you actually read all this? Legend 🏆");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#030305] text-[#F4F4F5] font-mono selection:bg-rose-500/30 selection:text-white antialiased min-h-screen relative">
      <ScrollBadge message={scrollMsg} />
      <Navigation />

      <HeroSection />
      <ChapterTwoSection />

      <div className="relative z-40 bg-[#030305] shadow-[0_-50px_100px_rgba(0,0,0,0.9)] rounded-t-[3rem] border-t border-white/10">
        <OutpostsSection />
        <ChronicleSection />
        <TriageSection />
        <ArchivesSection />

        <footer className="py-16 border-t border-white/10 bg-[#020203] text-center text-xs text-gray-500">
          PNEUMA ARCHIVE // 2026 // ALL RIGHTS RESERVED
        </footer>
      </div>
    </div>
  );
};