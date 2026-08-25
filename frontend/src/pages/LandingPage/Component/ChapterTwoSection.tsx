import React from "react";

export const ChapterTwoSection: React.FC = () => {
  return (
    <section
      id="chapter-two"
      className="relative w-full bg-[#030305] text-white z-30 border-t border-white/10 pt-28 md:pt-40 overflow-hidden font-mono select-none"
    >
      {/* Crimson Abyss Pulse */}
      <div className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] sm:w-[900px] sm:h-[900px] bg-rose-600/20 rounded-full blur-[180px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-[1900px] mx-auto px-4 md:px-8 flex flex-col items-center">
        
        {/* System Cut-Off Marker */}
        <div className="inline-flex items-center gap-3 text-gray-400 text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-12 border border-rose-500/30 px-6 py-2 bg-[#08080c]">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>CHAPTER_02 // THE SEVERED VOID // BLACKOUT ZONE</span>
        </div>

        {/* MONSTER STACKED TEXT THAT CLIPS OFF THE SCREEN EDGES */}
        <div className="w-full text-center space-y-[-2vw] md:space-y-[-3.5vw] overflow-hidden py-4">
          <div className="text-[18vw] sm:text-[16vw] md:text-[15vw] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-400 to-white leading-[0.75] whitespace-nowrap scale-105">
            CHAOS
          </div>
          <div className="text-[18vw] sm:text-[16vw] md:text-[15vw] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-500 to-rose-800 leading-[0.75] whitespace-nowrap">
            PAIN
          </div>
          <div className="text-[18vw] sm:text-[16vw] md:text-[15vw] font-black uppercase tracking-tighter text-rose-500 leading-[0.75] whitespace-nowrap drop-shadow-[0_0_50px_rgba(244,63,94,0.5)]">
            SUFFERING
          </div>
          {/* Last word cuts off right at the bottom edge, forcing the scroll */}
          <div className="text-[18vw] sm:text-[16vw] md:text-[15vw] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-rose-500 to-white leading-[0.75] whitespace-nowrap translate-y-6">
            POVERTY
          </div>
        </div>

      </div>

      {/* Hard Bottom Fade Transition Mask into Chapter 3 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent pointer-events-none z-20 flex items-end justify-center pb-6">
        <span className="text-[10px] tracking-[0.4em] uppercase text-rose-400 font-bold animate-bounce bg-black/80 px-6 py-2 border border-rose-500/40 rounded-full">
          // SCROLL TO BREACH THE VOID
        </span>
      </div>
    </section>
  );
};