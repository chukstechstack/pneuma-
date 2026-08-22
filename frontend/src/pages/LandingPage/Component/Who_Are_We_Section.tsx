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
      <div className={`text-center max-w-3xl mx-auto mb-24 transition-opacity duration-500 ${aboutVisible ? "opacity-100" : "opacity-0"}`}>
        <span className="text-gray-400 text-xs font-black tracking-[0.3em] uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10">
          Section 04 // Mission & Purpose
        </span>
        <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase mt-6 mb-6">
          Who Are We
        </h2>
        <p className="text-gray-300 font-sans text-base leading-relaxed">
          Driven by radical empathy, direct action, and an uncompromising mission to serve humanity.
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-8 flex flex-col justify-end pointer-events-none">
                <span className="text-gray-400 text-xs font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                  <Heart size={14} /> 0{idx + 1} // {img.category}
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