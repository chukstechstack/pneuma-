import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const HeroSection: React.FC = () => {
  const [activeHeroImg, setActiveHeroImg] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const heroImages = PNEUMA_IMAGES.slice(0, 3);

  useEffect(() => {
    const handleScroll = () => {
      // Switch nav style as soon as user scrolls past 50px
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="vanguard" className="relative w-full h-screen sticky top-0 overflow-hidden flex items-end">
      {/* Full-screen background image */}
      {heroImages.map((img, idx) => (
        <div key={img.id} className={`absolute inset-0 transition-all duration-1000 ${activeHeroImg === idx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}>
          <img src={img.url} alt={img.title} className="w-full h-full object-cover brightness-[0.9] contrast-[1.05]" />
        </div>
      ))}

      {/* DYNAMIC HUD NAVBAR (Morphs on scroll) */}
      <nav 
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl transition-all duration-500 flex items-center justify-between px-8 py-4 rounded-full ${
          isScrolled 
            ? "bg-black/80 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-3" // Dark glass style for rest of page
            : "bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-white/20" // Immersive image HUD style at top
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.9)]" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-white uppercase drop-shadow-md">PNEUMA // SYSTEM</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-widest text-white/90 font-medium">
          <a href="#vanguard" className="hover:text-rose-400 transition-colors drop-shadow cursor-pointer">01. Vanguard</a>
          <a href="#chapter-two" className="hover:text-rose-400 transition-colors drop-shadow cursor-pointer">02. Architecture</a>
          <a href="#outposts" className="hover:text-rose-400 transition-colors drop-shadow cursor-pointer">03. Outposts</a>
          <a href="#chronicle" className="hover:text-rose-400 transition-colors drop-shadow cursor-pointer">04. Chronicle</a>
          <a href="#archives" className="hover:text-rose-400 transition-colors drop-shadow cursor-pointer">05. Archives</a>
        </div>

        <Link 
          to="/auth?mode=signup" 
          className="text-[10px] uppercase tracking-widest bg-white/90 hover:bg-rose-500 text-black hover:text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:scale-105 backdrop-blur-sm"
        >
          Initialize
        </Link>
      </nav>

      {/* HERO CONTENT */}
      <div className="relative w-full p-8 md:p-24 z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12 max-w-[1700px] mx-auto">
        <div className="space-y-6 max-w-4xl">
           <div className="inline-flex items-center gap-2.5 text-rose-300 bg-black/40 backdrop-blur-xl px-5 py-2 border border-rose-500/30 rounded-full shadow-2xl">
              <Terminal size={12} className="text-rose-400 animate-pulse" /> 
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{heroImages[activeHeroImg]?.location}</span>
           </div>
           <h1 className="text-7xl sm:text-8xl md:text-[11rem] font-black tracking-tighter text-white uppercase leading-[0.82] drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
             Raw<br/>Reality
           </h1>
        </div>
        
        <div className="flex flex-col gap-6 lg:w-[420px]">
          <p className="text-white/90 font-sans font-medium text-base md:text-lg border-l-4 border-rose-500 pl-6 bg-black/40 backdrop-blur-xl p-6 rounded-r-2xl border-y border-r border-white/20 shadow-2xl">
            {heroImages[activeHeroImg]?.caption}
          </p>
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md p-3 rounded-full border border-white/20 w-fit shadow-xl">
            {heroImages.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveHeroImg(idx)} 
                className={`h-2 transition-all rounded-full cursor-pointer ${activeHeroImg === idx ? "w-16 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" : "w-8 bg-white/30 hover:bg-white/50"}`} 
                aria-label={`Slide ${idx + 1}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};