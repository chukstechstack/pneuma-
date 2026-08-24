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
      <div className="text-center max-w-4xl mx-auto mb-28">
        <span className="text-emerald-400 text-xs font-black tracking-[0.3em] uppercase flex items-center justify-center gap-2 mb-4">
          <ShieldCheck size={14} className="stroke-[2.5]" /> Section 06 // Our Covenant
        </span>
        <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase mb-6 leading-none">
          The Fierce Urgency <br className="hidden md:block"/> Of Now
        </h2>
        <p className="text-xl text-gray-400 font-serif italic max-w-2xl mx-auto leading-relaxed mb-4">
          "Darkness cannot drive out darkness; only light can do that."
        </p>
        <p className="text-gray-300 font-sans text-sm max-w-xl mx-auto leading-relaxed">
          We do not wait for committees, permits, or corporate permission. Where there is pain, we deploy. Where there is isolation, we stand. We break the machine to save the soul.
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
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.75] group-hover:brightness-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/60 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                <span className="text-emerald-400 text-[10px] font-black tracking-widest uppercase mb-1">
                  Covenant 0{idx + 1} // {img.category || "Action"}
                </span>
                <h3 className="text-lg font-black text-white uppercase tracking-wide mb-1 leading-snug">
                  {img.title}
                </h3>
                <p className="text-[12px] text-gray-300 font-sans leading-relaxed line-clamp-3">
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
