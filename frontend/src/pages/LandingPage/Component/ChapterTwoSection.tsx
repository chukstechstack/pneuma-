import React from "react";

export const ChapterTwoSection: React.FC = () => {
  return (
    <section
      id="chapter-two"
      className="relative w-full bg-[#030305] text-white z-30 border-t border-white/10 pt-20 md:pt-40 pb-20 overflow-hidden font-mono select-none"
    >
      {/* Static Background Glow (No blur shifting) */}
      <div className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[300px] h-[300px] sm:w-[900px] sm:h-[900px] bg-rose-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1900px] mx-auto px-4 md:px-8 flex flex-col items-center">
        
        {/* System Cut-Off Marker */}
        <div className="inline-flex items-center gap-3 text-gray-400 text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-8 md:mb-12 border border-rose-500/30 px-6 py-2 bg-[#08080c]">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
        </div>

        {/* STABILIZED TEXT WRAPPER (Solid colors, safe line-heights, zero jitter) */}
        <div className="w-full text-center space-y-2 sm:space-y-4 overflow-hidden py-2">
          <div className="text-[12vw] sm:text-[15vw] font-black uppercase tracking-tighter text-white leading-none">
            CHAOS
          </div>
          <div className="text-[12vw] sm:text-[15vw] font-black uppercase tracking-tighter text-rose-500 leading-none">
            PAIN
          </div>
          <div className="text-[12vw] sm:text-[15vw] font-black uppercase tracking-tighter text-white/90 leading-none">
            SUFFERING
          </div>
          <div className="text-[12vw] sm:text-[15vw] font-black uppercase tracking-tighter text-rose-600 leading-none">
            POVERTY
          </div>
        </div>

      </div>
    </section>
  );
};