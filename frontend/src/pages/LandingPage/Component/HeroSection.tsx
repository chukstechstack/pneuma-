import React, { useState, useEffect, useMemo } from "react";
import { Terminal, MousePointerClick } from "lucide-react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";

const heroStory = [
  {
    location: "Chapter 01 // The Human Crisis",
    headingLines: ["THE WAR", "ZONES"],
    caption:
      "Where bombs shatter communities, we refuse to look away. Bloodied soil and human collapse demand an immediate, unfiltered response. Silence is a betrayal.",
  },
  {
    location: "Chapter 02 // The Void Interval",
    headingLines: ["SIGNAL", "CUT OFF"],
    caption:
      "The broken-hearted are sealed behind absolute darkness, choked by walls of conflict and cold institutional apathy. A profound silence spans across the divide.",
  },
  {
    location: "Chapter 03 // The Quickening",
    headingLines: ["PNEUMA", "ARRIVES"],
    caption:
      "Where mechanical systems collapse and human strength breaks down, the spirit moves. Establishing field bases, raising leaders, and breaking isolation instantly.",
  },
];

export const HeroSection: React.FC = () => {
  const [activeHeroImg, setActiveHeroImg] = useState<number>(0);
  const [hasPlayedIntro, setHasPlayedIntro] = useState<boolean>(false);

  // Memoize slice so array reference remains stable across re-renders
  const heroImages = useMemo(() => PNEUMA_IMAGES.slice(0, 3), []);

  useEffect(() => {
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
      className="relative w-full h-screen overflow-hidden flex items-end bg-zinc-900 transform-gpu"
    >
      {/* Background Images - Composited via GPU opacity layers */}
      {heroImages.map((img, idx) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out transform-gpu ${
            activeHeroImg === idx
              ? "opacity-100 z-10"
              : "opacity-0 pointer-events-none z-0"
          }`}
        >
          <img
            src={img.url}
            alt={img.title}
            loading="eager"
            // @ts-ignore
            fetchpriority={idx === 0 ? "high" : "auto"}
            decoding="async"
            className="w-full h-full object-cover brightness-[1.05]"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* HERO CONTENT */}
      <div className="relative w-full p-6 sm:p-8 md:p-24 z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12 max-w-[1700px] mx-auto pb-12 md:pb-24 transform-gpu">
        <div className="space-y-4 md:space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2.5 text-rose-300 bg-black/80 px-4 md:px-5 py-2 border border-rose-500/40 rounded-full shadow-md">
            <Terminal size={12} className="text-rose-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
              {currentStory.location}
            </span>
          </div>

          {/* Headline without costly CSS dropshadows */}
          <h1 className="text-6xl sm:text-8xl md:text-[11rem] font-black tracking-tighter text-white uppercase leading-[0.82]">
            {currentStory.headingLines[0]}
            <br />
            {currentStory.headingLines[1]}
          </h1>
        </div>

        <div className="flex flex-col gap-5 md:gap-6 lg:w-[420px]">
          {/* Caption with solid alpha background instead of real-time blur */}
          <p className="text-white font-sans font-medium text-sm sm:text-base md:text-lg border-l-4 border-rose-500 pl-4 md:pl-6 bg-black/90 p-4 md:p-6 rounded-r-2xl border-y border-r border-white/20 shadow-md">
            {currentStory.caption}
          </p>

          {/* Interactive Selector Pod (Infinite bounce animation removed) */}
          <div className="flex items-center gap-3 bg-black/90 px-4 md:px-5 py-3 rounded-full border-2 border-emerald-500 w-fit shadow-[0_0_15px_rgba(16,185,129,0.2)]">
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
                  className={`h-3 transition-all duration-300 rounded-full cursor-pointer ${
                    activeHeroImg === idx
                      ? "w-10 md:w-12 bg-emerald-400"
                      : "w-5 md:w-6 bg-white/40 hover:bg-emerald-300"
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