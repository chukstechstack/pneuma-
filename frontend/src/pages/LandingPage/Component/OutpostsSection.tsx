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
      <div className={`flex flex-col xl:flex-row xl:items-end justify-between mb-20 gap-8 transition-opacity duration-500 ${outpostVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="max-w-4xl">
          <span className="text-emerald-500 text-xs font-black tracking-[0.3em] uppercase bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 flex items-center gap-2 w-fit mb-4">
            <ShieldCheck size={14} className="animate-pulse" /> Section 03 // The Quickening
          </span>
          <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase leading-[0.95]">
            PNEUMA
          </h2>
        </div>
        <div className="max-w-md border-l-2 border-emerald-500/30 pl-6 py-2">
          <p className="text-lg text-gray-300 font-serif italic leading-relaxed">
            "The spirit gives life; the flesh counts for nothing."
          </p>
          <p className="text-gray-400 font-sans text-sm mt-3 leading-relaxed">
            Where institutional systems fail and human breath falters, Pneuma moves. We are building active outposts, raising leaders in rural trenches, and bridging isolation with immediate, life-saving infrastructure.
          </p>
        </div>
      </div>

      {/* Asymmetric Bento Grid Gallery */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 transition-opacity duration-500 delay-100 ${outpostVisible ? "opacity-100" : "opacity-0"}`}>
        
        {/* Card 1 - Active Outpost */}
        {outposts[0] && (
          <div className="md:col-span-8 relative h-[520px] rounded-3xl overflow-hidden border border-white/15 group bg-[#0d0d14] [contain:paint] translate-z-0">
            <img 
              src={optimizeImg(outposts[0].url)} 
              alt={outposts[0].title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-10 flex flex-col justify-end pointer-events-none">
              <span className="text-emerald-400 text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                <ShieldCheck size={14} /> {outposts[0].location || "Frontline Outpost"}
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide mb-3">{outposts[0].title || "Establishing The Base"}</h3>
              <p className="text-gray-300 font-sans text-sm md:text-base max-w-xl leading-relaxed">{outposts[0].caption || "We place physical hubs directly where conflict and crisis strike. No waiting for permission. We secure the perimeter and deploy help instantly."}</p>
            </div>
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight size={18} className="text-white" />
            </div>
          </div>
        )}

        {/* Card 2 - Community Leader/Man Giving Speech */}
        {outposts[1] && (
          <div className="md:col-span-4 relative h-[520px] rounded-3xl overflow-hidden border border-white/15 group bg-[#0d0d14] [contain:paint] translate-z-0">
            <img 
              src={optimizeImg(outposts[1].url)} 
              alt={outposts[1].title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-10 flex flex-col justify-end pointer-events-none">
              <span className="text-emerald-400 text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                <ShieldCheck size={14} /> {outposts[1].location || "Rural Sovereignty"}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-3">{outposts[1].title || "Voices In The Wilderness"}</h3>
              <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed">{outposts[1].caption || "We empower voices on the ground to speak life back into broken regions. True recovery starts when community leaders are given the platform to guide their own people."}</p>
            </div>
          </div>
        )}

        {/* Card 3 - Community Girl Connecting */}
        {outposts[2] && (
          <div className="md:col-span-5 relative h-[420px] rounded-3xl overflow-hidden border border-white/15 group bg-[#0d0d14] [contain:paint] translate-z-0">
            <img 
              src={optimizeImg(outposts[2].url)} 
              alt={outposts[2].title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-10 flex flex-col justify-end pointer-events-none">
              <span className="text-emerald-400 text-xs font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                <ShieldCheck size={14} /> {outposts[2].location || "The Network Link"}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-2">{outposts[2].title || "Tearing Down Isolation"}</h3>
              <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed">{outposts[2].caption || "No one is out of reach. We place digital and physical anchors in forgotten sectors, connecting vulnerable souls to a global ecosystem of care."}</p>
            </div>
          </div>
        )}

        {/* Card 4 - The Rescue/Bridge Action */}
        {outposts[3] && (
          <div className="md:col-span-7 relative h-[420px] rounded-3xl overflow-hidden border border-white/15 group bg-[#0d0d14] [contain:paint] translate-z-0">
            <img 
              src={optimizeImg(outposts[3].url)} 
              alt={outposts[3].title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-10 flex flex-col justify-end pointer-events-none">
              <span className="text-emerald-400 text-xs font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                <ShieldCheck size={14} /> {outposts[3].location || "Active Operations"}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-2">{outposts[3].title || "Sprinting Across The Chasm"}</h3>
              <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed">{outposts[3].caption || "We don't stand at a distance and watch neighborhoods fall apart. Pneuma is the moving wind—we push into the crisis, bridge the gap, and build immediate sanctuaries."}</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
