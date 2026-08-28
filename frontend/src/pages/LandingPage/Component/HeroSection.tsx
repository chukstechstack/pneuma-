import React, { useState, useMemo } from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";

const heroStory = [
  {
    code: "01",
    headingLines: ["KOINONIA"],
    caption:
      "Where bombs shatter communities, we refuse to look away. Bloodied soil and human collapse demand an immediate, unfiltered response. Silence is a betrayal.",
  },
  {
    code: "02",
    headingLines: ["BROKEN", "WORLD"],
    caption:
      "The broken-hearted are sealed behind absolute darkness, choked by walls of conflict and cold institutional apathy. A profound silence spans across the divide.",
  },
  {
    code: "03",
    headingLines: ["HUMANITY"],
    caption:
      "Where mechanical systems collapse and human strength breaks down, the spirit moves. Establishing field bases, raising leaders, and breaking isolation instantly.",
  },
];

export const HeroSection: React.FC = () => {
  const [activeHeroImg, setActiveHeroImg] = useState<number>(0);

  const heroImages = useMemo(() => PNEUMA_IMAGES.slice(0, 3), []);
  const currentStory = heroStory[activeHeroImg] || heroStory[0];
  const currentImage = heroImages[activeHeroImg] || heroImages[0];

  return (
    <section
      id="vanguard"
      className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-end bg-zinc-900 select-none"
    >
      {/* Single Image Render (Lightweight source swapping with zero lag) */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentImage?.url}
          alt={currentImage?.title || "Pneuma Vanguard"}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center brightness-[1.05]"
        />
        {/* Solid dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative w-full px-5 sm:px-8 md:px-24 z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-12 max-w-[1700px] mx-auto pb-12 md:pb-24">
        
        {/* Left Heading Area */}
        <div className="space-y-2 md:space-y-6 max-w-4xl">
          <h1 className="text-4xl sm:text-7xl md:text-[11rem] font-black tracking-tight sm:tracking-tighter text-white uppercase leading-[1.05] sm:leading-[0.82]">
            {currentStory.headingLines[0]}
            {currentStory.headingLines[1] && (
              <>
                <br />
                {currentStory.headingLines[1]}
              </>
            )}
          </h1>
        </div>

        {/* Right Info & Tactical LED Switcher */}
        <div className="flex flex-col gap-4 md:gap-6 lg:w-[450px]">
          
          {/* Caption: Hidden on mobile, fully visible on tablets/desktops */}
          <div className="hidden sm:block space-y-4">
            <p className="text-white font-sans font-medium text-sm md:text-base border-l-4 border-rose-500 pl-4 md:pl-6 bg-black/90 p-4 md:p-6 rounded-r-2xl border-y border-r border-white/20 shadow-md">
              {currentStory.caption}
            </p>
          </div>

          {/* Tactical 3-Dot Switcher Bar with Clear Action Text */}
          <div className="flex items-center justify-between bg-black/90 px-5 py-3.5 rounded-xl border border-white/15 w-full">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                 DISPATCH_{currentStory.code}
              </span>
              <span className="text-[9px] font-mono text-emerald-400 tracking-wider uppercase animate-pulse">
                [CLICK LED TO SWITCH]
              </span>
            </div>

            {/* Interactive LED Status Dots */}
            <div className="flex items-center gap-3.5">
              {heroStory.map((_, idx) => {
                const isActive = activeHeroImg === idx;
                const dotColors = [
                  "bg-red-500 hover:bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.6)]",
                  "bg-amber-400 hover:bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]",
                  "bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]",
                ];

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveHeroImg(idx)}
                    aria-label={`Switch to story ${idx + 1}`}
                    className={`w-4 h-4 rounded-full transition-all duration-200 cursor-pointer ${dotColors[idx]} ${
                      isActive 
                        ? "scale-125 ring-2 ring-white/90" 
                        : "opacity-40 hover:opacity-100 scale-90"
                    }`}
                  />
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};