import React from "react";
import { BookOpen, Compass, Layers, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const ChapterTwoSection: React.FC = () => {
  const [chapterTwoRef, chapterTwoVisible] = useScrollReveal(0.2);

  return (
    <section id="chapter-two" ref={chapterTwoRef} className="relative w-full min-h-screen sticky top-0 overflow-hidden flex items-center justify-center bg-[#07070c] z-30 border-t border-white/15">
      {/* Clean Grid Accent (Zero Performance Cost) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className={`relative z-20 w-full max-w-[1700px] mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center transition-all duration-700 transform ${chapterTwoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        
        {/* Editorial Issue Tag */}
        <div className="inline-flex items-center gap-2.5 text-rose-400 bg-rose-500/10 px-6 py-2.5 rounded-full border border-rose-500/30 mb-8">
          <BookOpen size={14} className="text-rose-500" />
          <span className="text-[11px] uppercase tracking-[0.4em] font-black">Issue 02 // Structural Design</span>
        </div>

        {/* Impactful Magazine Headline */}
        <h2 className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter text-white uppercase leading-[0.9] mb-8">
          From Noise<br />To Clarity
        </h2>

        {/* Clear, Relatable Manifesto Body Copy */}
        <p className="text-gray-300 font-sans text-base md:text-xl max-w-4xl mx-auto leading-relaxed mb-16 font-medium">
          Modern society is saturated with noise, polarization, and institutional gridlock. Pneuma is an editorial and structural framework designed to cut through the distraction—mapping real-world problems to actionable, transparent solutions.
        </p>

        {/* Lightweight Magazine Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-left">
          
          {/* Card 1 */}
          <div className="relative p-8 rounded-2xl bg-[#0d0d14] border border-white/15 hover:border-rose-500 transition-colors duration-300 group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
              <Compass size={24} className="text-rose-400" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-rose-400 font-black mb-2 block">Phase 01 // Diagnosis</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3">Mapping Reality</h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              Exposing the root causes of systemic friction through investigative journalism, data visualization, and raw documentation.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-rose-400 transition-colors">
              <span>Read Essay</span>
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative p-8 rounded-2xl bg-[#0d0d14] border border-white/15 hover:border-rose-500 transition-colors duration-300 group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
              <Layers size={24} className="text-rose-400" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-rose-400 font-black mb-2 block">Phase 02 // Architecture</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3">Modular Frameworks</h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              Designing decentralized, open-access tools that empower communities to bypass broken infrastructure and coordinate directly.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-rose-400 transition-colors">
              <span>Explore Blueprints</span>
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative p-8 rounded-2xl bg-[#0d0d14] border border-white/15 hover:border-rose-500 transition-colors duration-300 group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
              <BookOpen size={24} className="text-rose-400" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-rose-400 font-black mb-2 block">Phase 03 // Execution</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3">Open Archives</h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              Permanent, tamper-proof records of every initiative, grant, and community response published openly for total accountability.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-rose-400 transition-colors">
              <span>View Records</span>
              <ArrowUpRight size={14} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};