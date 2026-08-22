import React from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export const OutpostsSection: React.FC = () => {
  const [outpostRef, outpostVisible] = useScrollReveal(0.05);
  const outposts = PNEUMA_IMAGES.slice(3, 7);

  const optimizeImg = (url: string) => {
    if (!url) return "";
    if (url.includes("unsplash.com")) {
      return `${url}?auto=format&fit=crop&w=1200&q=80`;
    }
    return url;
  };

  return (
    <section id="outposts" ref={outpostRef} className="relative py-40 px-6 md:px-12 max-w-[1700px] mx-auto z-20">
      
      {/* Section Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 transition-opacity duration-500 ${outpostVisible ? "opacity-100" : "opacity-0"}`}>
        <div>
          <span className="text-gray-400 text-xs font-black tracking-[0.3em] uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10">
            Frontline Relief & Field Units
          </span>
          <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase mt-6">
            Active Outposts<br />& Interventions
          </h2>
        </div>
        <p className="text-gray-300 font-sans max-w-md text-base leading-relaxed">
          Deploying critical infrastructure, emergency medical networks, and direct-action support straight to isolated communities where it matters most.
        </p>
      </div>

      {/* Asymmetric Bento Grid Gallery with Layout Containment to Prevent Shaking */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 transition-opacity duration-500 delay-100 ${outpostVisible ? "opacity-100" : "opacity-0"}`}>
        
        {/* Card 1 */}
        {outposts[0] && (
          <div className="md:col-span-8 relative h-[520px] rounded-3xl overflow-hidden border border-white/15 group bg-[#0d0d14] [contain:paint] translate-z-0">
            <img 
              src={optimizeImg(outposts[0].url)} 
              alt={outposts[0].title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-10 flex flex-col justify-end pointer-events-none">
              <span className="text-gray-400 text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                <ShieldCheck size={14} /> {outposts[0].location}
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide mb-3">{outposts[0].title}</h3>
              <p className="text-gray-300 font-sans text-sm md:text-base max-w-xl leading-relaxed">{outposts[0].caption}</p>
            </div>
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight size={18} className="text-white" />
            </div>
          </div>
        )}

        {/* Card 2 */}
        {outposts[1] && (
          <div className="md:col-span-4 relative h-[520px] rounded-3xl overflow-hidden border border-white/15 group bg-[#0d0d14] [contain:paint] translate-z-0">
            <img 
              src={optimizeImg(outposts[1].url)} 
              alt={outposts[1].title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-10 flex flex-col justify-end pointer-events-none">
              <span className="text-gray-400 text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                <ShieldCheck size={14} /> {outposts[1].location}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-3">{outposts[1].title}</h3>
              <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed">{outposts[1].caption}</p>
            </div>
          </div>
        )}

        {/* Card 3 */}
        {outposts[2] && (
          <div className="md:col-span-5 relative h-[420px] rounded-3xl overflow-hidden border border-white/15 group bg-[#0d0d14] [contain:paint] translate-z-0">
            <img 
              src={optimizeImg(outposts[2].url)} 
              alt={outposts[2].title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-10 flex flex-col justify-end pointer-events-none">
              <span className="text-gray-400 text-xs font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                <ShieldCheck size={14} /> {outposts[2].location}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-2">{outposts[2].title}</h3>
              <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed">{outposts[2].caption}</p>
            </div>
          </div>
        )}

        {/* Card 4 */}
        {outposts[3] && (
          <div className="md:col-span-7 relative h-[420px] rounded-3xl overflow-hidden border border-white/15 group bg-[#0d0d14] [contain:paint] translate-z-0">
            <img 
              src={optimizeImg(outposts[3].url)} 
              alt={outposts[3].title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-10 flex flex-col justify-end pointer-events-none">
              <span className="text-gray-400 text-xs font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                <ShieldCheck size={14} /> {outposts[3].location}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-2">{outposts[3].title}</h3>
              <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed">{outposts[3].caption}</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};