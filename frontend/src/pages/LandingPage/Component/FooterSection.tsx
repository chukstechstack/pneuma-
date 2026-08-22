import React from "react";
import { Heart, ArrowUpRight } from "lucide-react";

export const FooterSection: React.FC = () => {
  return (
    <footer className="pt-28 pb-16 px-6 md:px-12 max-w-[1700px] mx-auto z-20 relative border-t border-white/10">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
        
        {/* Brand & Statement */}
        <div className="max-w-xl">
          <span className="text-emerald-400 text-xs font-black tracking-[0.3em] uppercase block mb-4">
            // Pneuma Protocol Matrix
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Changing Humanity.
          </h2>
          <p className="text-gray-400 font-sans text-sm leading-relaxed">
            An uncompromising mission to eradicate silence, fund critical medical care, rescue those trapped in isolation, and restore genuine human agency.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div className="flex flex-wrap gap-8 md:gap-16 font-sans text-xs uppercase font-bold tracking-widest">
          <div className="flex flex-col gap-3">
            <span className="text-gray-500 font-mono">// Directory</span>
            <a href="#about-us" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group">
              <span>04 // Who We Are</span>
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="#triage" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group">
              <span>05 // The Crisis</span>
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="#solutions" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group">
              <span>06 // Solutions</span>
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-gray-500 font-mono">// External</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group">
              <span>GitHub Source</span>
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group">
              <span>Network / X</span>
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="mailto:contact@pneuma.org" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group">
              <span>Contact Dispatch</span>
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono gap-4 pt-8 border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} Pneuma Protocol. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          BUILT WITH <Heart size={12} className="text-rose-500 fill-rose-500" /> FOR HUMANITY
        </p>
      </div>

    </footer>
  );
};