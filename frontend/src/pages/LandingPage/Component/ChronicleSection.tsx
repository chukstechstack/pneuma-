import React from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const ChronicleSection: React.FC = () => {
  const [chronicleRef] = useScrollReveal(0.1);
  const chronicle = PNEUMA_IMAGES.slice(7, 11);

  return (
    <section id="chronicle" ref={chronicleRef} className="py-40 px-6 md:px-12 max-w-[1700px] mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-24">
        <span className="text-rose-400 text-xs font-bold tracking-[0.3em] uppercase">Sector 04 // Behavioral Core</span>
        <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-white uppercase mt-3 mb-6">Breaking Chains</h2>
        <p className="text-gray-400 font-sans text-base">
          Systematic dismantling of digital loops and rebuilding focus through high-friction protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {chronicle.map((img, idx) => {
          const staggerClass = idx % 2 !== 0 ? "lg:translate-y-12" : "lg:-translate-y-6";
          
          return (
            <div 
              key={img.id} 
              className={`relative h-[480px] rounded-3xl overflow-hidden border border-white/15 group shadow-2xl transition-all duration-500 ${staggerClass}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-6 flex flex-col justify-end">
                <span className="text-rose-400 font-mono text-[10px] tracking-widest uppercase mb-1">0{idx + 1} // {img.category}</span>
                <h3 className="text-xl font-bold text-white mb-2">{img.title}</h3>
                <p className="text-gray-300 font-sans text-xs line-clamp-2">{img.caption}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};