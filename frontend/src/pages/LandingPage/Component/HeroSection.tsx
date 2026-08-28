import React, { useState, useEffect, useMemo } from "react";
import { MousePointerClick } from "lucide-react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";

const heroStory = [
  {
    headingLines: ["HUMMANITY"],
    caption:
      "Where bombs shatter communities, we refuse to look away. Bloodied soil and human collapse demand an immediate, unfiltered response. Silence is a betrayal.",
  },
  {
    headingLines: ["BROKEN", "WORLD"],
    caption:
      "The broken-hearted are sealed behind absolute darkness, choked by walls of conflict and cold institutional apathy. A profound silence spans across the divide.",
  },
  {
    headingLines: ["KOINONIA"],
    caption:
      "Where mechanical systems collapse and human strength breaks down, the spirit moves. Establishing field bases, raising leaders, and breaking isolation instantly.",
  },
];

export const HeroSection: React.FC = () => {
  const [activeHeroImg, setActiveHeroImg] = useState<number>(0);
  const [hasPlayedIntro, setHasPlayedIntro] = useState<boolean>(false);

  const heroImages = useMemo(() => PNEUMA_IMAGES.slice(0, 3), []);

  useEffect(() => {
    // Check if device is mobile (less than 768px wide)
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setActiveHeroImg(0); // Lock to first image on mobile
      return;
    }

    if (hasPlayedIntro) return;

    let step = 0;
    const introInterval = setInterval(() => {
      step++;
      if (step < heroImages.length) {
        setActiveHeroImg(step);
      } else {
        setActiveHeroImg(0);
        setHasPlayedIntro(true);
        clearInterval(introInterval);
      }
    }, 4000);

    return () => clearInterval(introInterval);
  }, [hasPlayedIntro, heroImages.length]);

  const currentStory = heroStory[activeHeroImg] || heroStory[0];

  return (
    <section
      id="vanguard"
      className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-end bg-zinc-900"
    >
      {/* Background Images */}
      {heroImages.map((img, idx) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            activeHeroImg === idx
              ? "opacity-100 z-10"
              : "opacity-0 pointer-events-none z-0"
          }`}
        >
          <img
            src={img.url}
            alt={img.title}
            loading="eager"
            fetchPriority={idx === 0 ? "high" : "auto"}
            decoding="async"
            className="w-full h-full object-cover object-center brightness-[1.05]"
          />
          {/* Subtle gradient at the bottom so headlines stay readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>
      ))}

      {/* HERO CONTENT */}
      <div className="relative w-full px-5 sm:px-8 md:px-24 z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-12 max-w-[1700px] mx-auto pb-12 md:pb-24">
        
        <div className="space-y-2 md:space-y-6 max-w-4xl">
          <h1 className="text-4xl sm:text-7xl md:text-[11rem] font-black tracking-tight sm:tracking-tighter text-white uppercase leading-[1.05] sm:leading-[0.82]">
            {currentStory.headingLines[0]}
            <br />
            {currentStory.headingLines[1]}
          </h1>
        </div>

        <div className="flex flex-col gap-3 md:gap-6 lg:w-[420px]">
          {/* Caption: Hidden on mobile, visible on tablets/desktops */}
          <p className="hidden sm:block text-white font-sans font-medium text-sm md:text-lg border-l-4 border-rose-500 pl-4 md:pl-6 bg-black/80 backdrop-blur-md p-4 md:p-6 rounded-r-2xl border-y border-r border-white/20 shadow-md">
            {currentStory.caption}
          </p>

          {/* Interactive Selector Pod: Completely hidden on mobile to keep it clean */}
          <div className="hidden sm:flex items-center gap-3 bg-black/80 backdrop-blur-md px-3.5 md:px-5 py-2.5 md:py-3 rounded-full border-2 border-emerald-500 w-fit shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-emerald-300 font-extrabold pr-1">
              <MousePointerClick size={14} className="text-emerald-400" />
              <span>Select:</span>
            </div>

            <div className="flex items-center gap-2">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveHeroImg(idx);
                    setHasPlayedIntro(true);
                  }}
                  className={`h-2.5 md:h-3 transition-all duration-300 rounded-full cursor-pointer ${
                    activeHeroImg === idx
                      ? "w-8 md:w-12 bg-emerald-400"
                      : "w-4 md:w-6 bg-white/40 hover:bg-emerald-300"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};