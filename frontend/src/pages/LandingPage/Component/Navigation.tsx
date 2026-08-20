import React from "react";
import { Link } from "react-router-dom";

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl bg-[#0a0a0f]/80 backdrop-blur-2xl border border-white/10 px-8 py-4 flex items-center justify-between rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
        <span className="text-[10px] font-bold tracking-[0.3em] text-white uppercase">PNEUMA // SYSTEM</span>
      </div>
      <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-widest text-gray-400">
        <a href="#vanguard" className="hover:text-white transition-colors">01. Vanguard</a>
        <a href="#chapter-two" className="hover:text-rose-400 transition-colors">02. Architecture</a>
        <a href="#outposts" className="hover:text-white transition-colors">03. Outposts</a>
        <a href="#chronicle" className="hover:text-white transition-colors">04. Chronicle</a>
        <a href="#archives" className="hover:text-white transition-colors">05. Archives</a>
      </div>
      <Link to="/auth?mode=signup" className="text-[10px] uppercase tracking-widest bg-white text-black hover:bg-rose-500 hover:text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:scale-105">
        Initialize
      </Link>
    </nav>
  );
};