import React from "react";
import { BookOpen, Compass, Layers, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const ChapterTwoSection: React.FC = () => {
  const [chapterTwoRef, chapterTwoVisible] = useScrollReveal(0.2);

  return (
    <section id="chapter-two" ref={chapterTwoRef} className="relative w-full min-h-screen sticky top-0 overflow-hidden flex items-center justify-center bg-[#07070c] z-30 border-t border-white/15">
      {/* Clean Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className={`relative z-20 w-full max-w-[1700px] mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center transition-all duration-700 transform ${chapterTwoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        
        {/* Editorial Issue Tag */}
        <div className="inline-flex items-center gap-2.5 text-rose-400 bg-rose-500/10 px-6 py-2.5 rounded-full border border-rose-500/30 mb-8">
          <BookOpen size={14} className="text-rose-500" />
          <span className="text-[11px] uppercase tracking-[0.4em] font-black">Chapter 02 // The Way Forward</span>
        </div>

        {/* Impactful Magazine Headline */}
        <h2 className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter text-white uppercase leading-[0.9] mb-8">
          LET US BUILD <br /> BRIDGES
        </h2>

        {/* Clear, Relatable Manifesto Body Copy */}
        <p className="text-gray-300 font-sans text-base md:text-xl max-w-4xl mx-auto leading-relaxed mb-16 font-medium">
          The broken-hearted are cut off from rescue by walls of conflict, isolation, and institutional apathy. Pneuma is not a passive platform—it is the engineering of an active, unbreakable highway straight into the trenches of human suffering.
        </p>

        {/* Lightweight Magazine Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-left">
          
          {/* Card 1 */}
          <div className="relative p-8 rounded-2xl bg-[#0d0d14] border border-white/15 hover:border-rose-500 transition-colors duration-300 group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
              <Compass size={24} className="text-rose-400" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-rose-400 font-black mb-2 block">Foundation 01 // The Survey</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3">Locating The Broken</h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              We find the exact points where communities are fractured. We identify where war zones, addiction crises, and systemic neglect have cut people off from basic survival.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-rose-400 transition-colors">
              <span>View Active Sites</span>
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative p-8 rounded-2xl bg-[#0d0d14] border border-white/15 hover:border-rose-500 transition-colors duration-300 group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
              <Layers size={24} className="text-rose-400" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-rose-400 font-black mb-2 block">Foundation 02 // The Span</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3">Uncompromising Links</h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              Forging rapid-response tunnels that allow financial aid, direct supplies, and field staff to bypass political roadblocks and deliver help instantly into conflict zones.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-rose-400 transition-colors">
              <span>See Infrastructure</span>
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative p-8 rounded-2xl bg-[#0d0d14] border border-white/15 hover:border-rose-500 transition-colors duration-300 group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
              <BookOpen size={24} className="text-rose-400" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-rose-400 font-black mb-2 block">Foundation 03 // The Crossing</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3">Active Influx</h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              Moving across the dividing lines to establish immediate sanctuaries. This is the structural blueprint that prepares the ground for Pneuma to deploy and breathe life back into the community.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-rose-400 transition-colors">
              <span>Track Aid Flows</span>
              <ArrowUpRight size={14} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
