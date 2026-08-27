import React from "react";
import { Link } from "react-router-dom";

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[8px] px-6 lg:px-10 py-5 flex items-center justify-between font-mono">
      {/* Brand Identifier */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,1)]" />
        <span className="text-lg font-black tracking-[0.3em] text-white uppercase not-italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          PNEUMA .
        </span>
      </Link>
      
      {/* Seamless Glass Rectangular Boxed Nav Links */}
      <div className="hidden lg:flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black not-italic">
        <a href="#vanguard" className="px-4 py-2 rounded-md border border-white/15 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white hover:text-black hover:border-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer">
          Vanguard
        </a>
        <a href="#chapter-two" className="px-4 py-2 rounded-md border border-white/15 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white hover:text-black hover:border-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer">
          Architecture
        </a>
        <a href="#outposts" className="px-4 py-2 rounded-md border border-white/15 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white hover:text-black hover:border-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer">
          Outposts
        </a>
        <a href="#about-us" className="px-4 py-2 rounded-md border border-white/15 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white hover:text-black hover:border-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer">
          Our Mission
        </a>
      </div>

      {/* Action Buttons: Come On In & Join */}
      <div className="flex items-center gap-4">
        <Link 
          to="/login" 
          className="px-5 py-2 rounded-md border border-white/15 bg-white/[0.03] backdrop-blur-md text-sm uppercase tracking-widest font-black text-white hover:bg-white hover:text-black transition-all not-italic shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          Come On In
        </Link>
        <Link 
          to="/register" 
          className="text-sm uppercase tracking-widest bg-white hover:bg-emerald-500 text-black hover:text-white px-6 py-2.5 rounded-md font-black not-italic transition-all shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:scale-105"
        >
          Join
        </Link>
      </div>
    </nav>
  );
};