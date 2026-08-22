import React, { useState, useEffect } from "react";
import { LoadingScreen } from "./Component/LoadingScreen";
import { Navigation } from "./Component/Navigation";
import { ScrollBadge } from "./Component/ScrollBadge";
import { HeroSection } from "./Component/HeroSection";
import { ChapterTwoSection } from "./Component/ChapterTwoSection";
import { OutpostsSection } from "./Component/OutpostsSection";
import { WhoWeAre } from "./Component/Who_Are_We_Section";
import { ProblemSection } from "./Component/ProblemSection";
import { SolutionSection } from "./Component/SolutionSection";
import { FooterSection } from "./Component/FooterSection";

export const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollMsg, setScrollMsg] = useState("Viewing the abyss... 🌌");

  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = scrollPos / docHeight;

      if (progress < 0.15) setScrollMsg("Viewing the abyss... 🌌");
      else if (progress < 0.3) setScrollMsg("Chapter 02: Unlocking core architecture... ⚡");
      else if (progress < 0.5) setScrollMsg("Outposts & networks active 🌐");
      else if (progress < 0.7) setScrollMsg("Mission & purpose engaged 🤝");
      else if (progress < 0.9) setScrollMsg("Crisis triage protocols active 🚨");
      else if (progress < 0.95) setScrollMsg("Direct intervention deployed 🛡️");
      else setScrollMsg("Bro you actually read all this? Legend 🏆");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  return (
    <div className="bg-[#030305] text-[#F4F4F5] font-mono selection:bg-rose-500/30 selection:text-white antialiased min-h-screen relative">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <>
          <ScrollBadge message={scrollMsg} />
          <Navigation />
        </>
      )}

      <HeroSection />
      <ChapterTwoSection />

      <div className="relative z-40 bg-[#030305] shadow-[0_-50px_100px_rgba(0,0,0,0.9)] rounded-t-[3rem] border-t border-white/10">
        <OutpostsSection />
        <WhoWeAre />
        <ProblemSection />
        <SolutionSection />
        <FooterSection />
      </div>
    </div>
  );
};