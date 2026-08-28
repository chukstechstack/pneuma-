import React from "react";

export const ChapterTwoSection: React.FC = () => {
  return (
    <section
      id="chapter-two"
      className="relative w-full bg-[#030305] text-white z-30 border-t border-white/10 py-20 md:py-32 px-6 md:px-12 overflow-hidden font-mono select-none"
    >
      {/* Static Background Glow */}
      <div className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[300px] h-[300px] sm:w-[900px] sm:h-[900px] bg-rose-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto flex flex-col items-center">
        
     


        {/* STABILIZED TEXT WRAPPER (Swapped vw for fixed responsive classes to stop mobile jitter) */}
        <div className="w-full text-center space-y-2 sm:space-y-4 overflow-hidden py-2">
          <div className="text-6xl sm:text-8xl lg:text-[11rem] font-black uppercase tracking-tighter text-white leading-[0.9]">
            CHAOS
          </div>
          <div className="text-6xl sm:text-8xl lg:text-[11rem] font-black uppercase tracking-tighter text-rose-500 leading-[0.9]">
            PAIN
          </div>
          <div className="text-6xl sm:text-8xl lg:text-[11rem] font-black uppercase tracking-tighter text-white/90 leading-[0.9]">
            SUFFERING
          </div>
          <div className="text-6xl sm:text-8xl lg:text-[11rem] font-black uppercase tracking-tighter text-rose-600 leading-[0.9]">
            POVERTY
          </div>
        </div>

      </div>
    </section>
  );
};