import React from "react";
import { Sparkles, Cpu, Lock, Globe } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const ChapterTwoSection: React.FC = () => {
  const [chapterTwoRef, chapterTwoVisible] = useScrollReveal(0.2);

  return (
    <section id="chapter-two" ref={chapterTwoRef} className="relative w-full min-h-screen sticky top-0 overflow-hidden flex items-center justify-center bg-[#07070c] z-30 border-t border-white/15 shadow-[0_-60px_120px_rgba(0,0,0,0.95)]">
      <div className={`relative z-20 w-full max-w-[1700px] mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center transition-all duration-1000 transform ${chapterTwoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
        <div className="inline-flex items-center gap-2.5 text-rose-400 bg-rose-500/10 px-6 py-2.5 rounded-full border border-rose-500/30 mb-8">
          <Sparkles size={14} className="text-rose-500 animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Chapter 02 // Core Infrastructure</span>
        </div>
        <h2 className="text-6xl sm:text-8xl md:text-[10rem] font-bold tracking-tighter text-white uppercase leading-[0.9] mb-8">Beyond<br />The Surface</h2>
        <p className="text-gray-300 font-sans text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-16">
          Chapter one revealed the human toll. Chapter two exposes the machinery—unveiling automated telemetry nodes and zero-gatekeeper networks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
          <div className="p-8 rounded-3xl bg-[#0d0d14]/80 border border-white/10 space-y-3">
            <Cpu size={20} className="text-rose-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Automated Nodes</h3>
            <p className="text-sm text-gray-400 font-sans">Real-time data synchronization bypassing traditional institutional latency.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0d0d14]/80 border border-white/10 space-y-3">
            <Lock size={20} className="text-rose-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Zero Gatekeeping</h3>
            <p className="text-sm text-gray-400 font-sans">Direct-to-source deployment models ensuring aid and metrics arrive unvarnished.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0d0d14]/80 border border-white/10 space-y-3">
            <Globe size={20} className="text-rose-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Global Symposia</h3>
            <p className="text-sm text-gray-400 font-sans">Verified operator networks spanning 20 critical geographic sectors.</p>
          </div>
        </div>
      </div>
    </section>
  );
};