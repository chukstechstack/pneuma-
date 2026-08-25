import React, { useState } from "react";
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

  return (
    <div className="bg-[#030305] text-[#F4F4F5] font-mono selection:bg-rose-500/30 selection:text-white antialiased min-h-screen relative transform-gpu">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <>
          <ScrollBadge message="PNEUMA // ACTIVE SYSTEM" />
          <Navigation />
        </>
      )}

      <HeroSection />
      <ChapterTwoSection />

      <div className="relative z-40 bg-[#030305] rounded-t-[3rem] border-t border-white/10 transform-gpu will-change-transform">
        <OutpostsSection />
        <WhoWeAre />
        <ProblemSection />
        <SolutionSection />
        <FooterSection />
      </div>
    </div>
  );
};