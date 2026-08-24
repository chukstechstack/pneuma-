import React from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Heart } from "lucide-react";

export const WhoWeAre: React.FC = () => {
  const [aboutRef, aboutVisible] = useScrollReveal(0.05);
  
  // Sliced from 7 to 11 (adjust these indices if your array slice needs to be 11 to 15)
  const aboutCards = PNEUMA_IMAGES.slice(7, 11);

  return (
    <section id="about-us" ref={aboutRef} className="py-40 px-6 md:px-12 max-w-[1700px] mx-auto z-20 relative">
      
      {/* Section Header */}
      <div className={`text-center max-w-4xl mx-auto mb-24 transition-opacity duration-500 ${aboutVisible ? "opacity-100" : "opacity-0"}`}>
        <span className="text-emerald-400 text-xs font-black tracking-[0.3em] uppercase bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
          Section 04 // The Moral Line
        </span>
        <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase mt-6 mb-6 leading-[0.95]">
          We Are Our <br className="hidden md:block" /> Brother's Keeper
        </h2>
        <p className="text-xl text-gray-400 font-serif italic max-w-2xl mx-auto leading-relaxed mb-4">
          "We must learn to live together as brothers or perish together as fools."
        </p>
        <p className="text-gray-300 font-sans text-sm max-w-xl mx-auto leading-relaxed">
          Pneuma is not a company, a product, or a tech showcase. We are a decentralized line of defense for human dignity. If a bomb falls, if a soul struggles in addiction, or if a community is left in darkness—we show up.
        </p>
      </div>

      {/* 4-Column Clean Straight Grid with Layout Containment */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-opacity duration-500 delay-100 ${aboutVisible ? "opacity-100" : "opacity-0"}`}>
        {aboutCards.map((img, idx) => {
          return (
            <div 
              key={img.id || idx} 
              className="relative h-[480px] rounded-3xl overflow-hidden border border-white/15 group bg-[#0d0d14] shadow-2xl transition-all duration-500 [contain:paint] translate-z-0"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.75] group-hover:brightness-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-8 flex flex-col justify-end pointer-events-none">
                <span className="text-emerald-400 text-xs font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                  <Heart size={14} className="fill-emerald-500/10" /> 0{idx + 1} // Sacred Duty
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-2">{img.title}</h3>
                <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed line-clamp-3">{img.caption}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
