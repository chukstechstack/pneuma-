import React, { useState, useEffect } from "react";
import { Terminal, MousePointerClick } from "lucide-react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { Navigation } from "./Navigation"; // <-- Import the new navbar component

// Hero story configuration featuring your favorite headlines and captions
const heroStory = [
  {
    location: "",
    headingLines: ["Raw", "Reality"],
    caption: "We didn’t build this to escape the world. We built it to remember what it feels like to live in it unmasked, unfiltered, and wide awake."
  },
  {
    location: "",
    headingLines: ["Clear", "Vision"],
    caption: "The old systems were designed to contain us. The next iteration is built to expand us—turning raw noise into crystal-clear intent."
  },
  {
    location: "",
    headingLines: ["Own", "Tomorrow"],
    caption: "Evolution isn't a destination; it's a constant recalibration. Stand at the edge, look forward, and build the reality you refuse to wait for."
  }
];

export const HeroSection: React.FC = () => {
  const [activeHeroImg, setActiveHeroImg] = useState<number>(0);
  const [hasPlayedIntro, setHasPlayedIntro] = useState<boolean>(false);
  const heroImages = PNEUMA_IMAGES.slice(0, 3);

  // Cinematic Intro Sequence: 4 seconds per slide for comfortable reading
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
    <section id="vanguard" className="relative w-full h-screen sticky top-0 overflow-hidden flex items-end bg-zinc-900">
      {/* Full-screen background images */}
      {heroImages.map((img, idx) => (
        <div 
          key={img.id} 
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            activeHeroImg === idx 
              ? "opacity-100 scale-100 z-10" 
              : "opacity-0 scale-105 pointer-events-none z-0"
          }`}
        >
          <img 
            src={img.url} 
            alt={img.title} 
            className="w-full h-full object-cover brightness-[1.2] contrast-[1.05]" 
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ))}

      {/* RENDER THE SEPARATE NAVIGATION COMPONENT */}
      <Navigation />

      {/* HERO CONTENT */}
      <div className="relative w-full p-8 md:p-24 z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12 max-w-[1700px] mx-auto">
        <div className="space-y-6 max-w-4xl">
           <div className="inline-flex items-center gap-2.5 text-rose-300 bg-black/60 backdrop-blur-xl px-5 py-2 border border-rose-500/40 rounded-full shadow-2xl transition-all duration-500">
              <Terminal size={12} className="text-rose-400 animate-pulse" /> 
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{currentStory.location}</span>
           </div>
           
           {/* Dynamic Headline changing per step */}
           <h1 className="text-7xl sm:text-8xl md:text-[11rem] font-black tracking-tighter text-white uppercase leading-[0.82] drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-all duration-500">
             {currentStory.headingLines[0]}<br/>{currentStory.headingLines[1]}
           </h1>
        </div>
        
        <div className="flex flex-col gap-6 lg:w-[420px]">
          {/* Dynamic Caption matching the chapter */}
          <p className="text-white font-sans font-medium text-base md:text-lg border-l-4 border-rose-500 pl-6 bg-black/60 backdrop-blur-xl p-6 rounded-r-2xl border-y border-r border-white/20 shadow-2xl transition-all duration-500">
            {currentStory.caption}
          </p>

          {/* INTERACTIVE SELECTOR POD */}
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-5 py-3.5 rounded-full border-2 border-emerald-500 w-fit shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-bounce">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-emerald-300 font-extrabold pr-1">
              <MousePointerClick size={14} className="text-emerald-400 animate-pulse" />
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
                  className={`h-3 transition-all duration-500 rounded-full cursor-pointer hover:scale-125 hover:shadow-[0_0_15px_rgba(16,185,129,1)] ${
                    activeHeroImg === idx 
                      ? "w-12 bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" 
                      : "w-6 bg-white/50 hover:bg-emerald-300"
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