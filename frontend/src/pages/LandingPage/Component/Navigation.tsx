import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ArrowUpRight } from "lucide-react";

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-[10px] px-6 lg:px-10 py-4 lg:py-5 flex items-center justify-between font-mono">
      {/* Brand Identifier */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,1)]" />
        <span className="text-lg font-black tracking-[0.3em] text-white uppercase not-italic">
          PNEUMA .
        </span>
      </Link>
      
      {/* Desktop Nav Links */}
      <div className="hidden lg:flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black not-italic">


        <a href="#outposts" className="px-4 py-2 rounded-md border border-white/15 bg-white/[0.03] text-white hover:bg-white hover:text-black transition-all">Our Legacy</a>
        <a href="#about-us" className="px-4 py-2 rounded-md border border-white/15 bg-white/[0.03] text-white hover:bg-white hover:text-black transition-all">Our Mission</a>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden lg:flex items-center gap-4">
        <Link to="/login" className="px-5 py-2 rounded-md border border-white/15 bg-white/[0.03] text-sm uppercase tracking-widest font-black text-white hover:bg-white hover:text-black transition-all">Come On In</Link>
        <Link to="/register" className="text-sm uppercase tracking-widest bg-white hover:bg-emerald-500 text-black hover:text-white px-6 py-2.5 rounded-md font-black transition-all">Join</Link>
      </div>

      {/* Clean 2-Line Custom Mobile Toggle (Gemini-style) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden text-emerald-400 p-2.5 rounded border border-emerald-500/40 bg-black/80 focus:outline-none z-50 flex flex-col justify-between w-10 h-10 cursor-pointer"
        aria-label="Open Menu"
      >
        <span className="w-full h-0.5 bg-emerald-400 rounded-full" />
        <span className="w-full h-0.5 bg-emerald-400 rounded-full" />
      </button>

      {/* Full-Screen Opaque Dropdown Overlay */}
      {isOpen && (
        <div className="fixed inset-0 w-screen h-[100dvh] z-[9999] bg-[#050507] flex flex-col justify-between px-6 py-8 lg:hidden overflow-y-auto">
          
          {/* Top Row: Logo & Close Button */}
          <div className="flex items-center justify-between w-full">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-lg font-black tracking-[0.3em] text-white uppercase">PNEUMA .</span>
            </Link>
            <button 
              onClick={closeMenu}
              className="text-white p-2.5 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Center Links */}
          <div className="flex flex-col items-center justify-center gap-6 my-auto text-center py-8">
            <a href="#outposts" onClick={closeMenu} className="text-2xl sm:text-3xl font-black text-white hover:text-emerald-400 uppercase tracking-wider transition-colors">LEGACY</a>
            <a href="#about-us" onClick={closeMenu} className="text-2xl sm:text-3xl font-black text-white hover:text-emerald-400 uppercase tracking-wider transition-colors">Our Mission</a>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-3 w-full pt-6 border-t border-white/10 shrink-0">
            <Link to="/login" onClick={closeMenu} className="w-full py-3.5 rounded-xl border border-white/20 bg-white/5 text-sm uppercase tracking-widest font-black text-white text-center flex items-center justify-center gap-2">
              Come On In <ArrowUpRight size={18} />
            </Link>
            <Link to="/register" onClick={closeMenu} className="w-full py-3.5 text-sm uppercase tracking-widest bg-white text-black text-center rounded-xl font-black hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2">
              Join OUR COMMUNITY<ArrowUpRight size={18} />
            </Link>
          </div>

        </div>
      )}
    </nav>
  );
};