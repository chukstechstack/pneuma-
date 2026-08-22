import React from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { ShieldCheck } from "lucide-react";

export const SolutionSection: React.FC = () => {
  const [solutionRef, solutionVisible] = useScrollReveal(0.1);
  const solutions = PNEUMA_IMAGES.slice(15, 20);

  return (
    <section id="solutions" ref={solutionRef} className={`py-40 px-6 md:px-12 max-w-[1700px] mx-auto transition-opacity duration-700 ${solutionVisible ? "opacity-100" : "opacity-0"}`}>
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-emerald-400 text-xs font-black tracking-[0.3em] uppercase flex items-center justify-center gap-2 mb-3">
          <ShieldCheck size={14} /> Sector 06 // Direct Intervention
        </span>
        <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase mb-4">
          The Solution Protocol
        </h2>
        <p className="text-gray-300 font-sans text-sm leading-relaxed">
          Bypassing bureaucratic delays to deliver immediate financial relief, medical funding, and boots-on-the-ground rescue.
        </p>
      </div>

      {/* 5-Column Staggered Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {solutions.map((img, idx) => {
          const heightClass = idx % 2 === 0 ? "h-[420px] lg:translate-y-4" : "h-[360px] lg:-translate-y-6";

          return (
            <div 
              key={img.id || idx} 
              className={`relative rounded-3xl overflow-hidden border border-white/15 group shadow-xl transition-all duration-500 bg-[#0d0d14] ${heightClass}`}
            >
              <img 
                src={img.url} 
                alt={img.title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                <span className="text-emerald-400 text-[10px] font-black tracking-widest uppercase mb-1">
                  Protocol 0{idx + 1} // {img.category || "Action"}
                </span>
                <h3 className="text-base font-black text-white uppercase tracking-wide mb-1 leading-snug">
                  {img.title}
                </h3>
                <p className="text-[11px] text-gray-300 font-sans line-clamp-2">
                  {img.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};