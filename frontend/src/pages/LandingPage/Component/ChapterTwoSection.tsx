import React from "react";

export const ChapterTwoSection: React.FC = () => {
  return (
    <section
      id="chapter-two"
      className="w-full bg-[#030305] text-white border-t border-white/10 py-16 sm:py-20 px-6 md:px-12 font-mono select-none"
    >
      <div className="max-w-6xl mx-auto text-center">
        <div className="space-y-1 sm:space-y-2">
          <div className="text-4xl sm:text-6xl md:text-7xl font-light uppercase tracking-wide text-white leading-tight">
            CHAOS
          </div>
          <div className="text-4xl sm:text-6xl md:text-7xl font-light uppercase tracking-wide text-white leading-tight">
            PAIN
          </div>
          <div className="text-4xl sm:text-6xl md:text-7xl font-light uppercase tracking-wide text-white leading-tight">
            SUFFERING
          </div>
          <div className="text-4xl sm:text-6xl md:text-7xl font-light uppercase tracking-wide text-white leading-tight">
            POVERTY
          </div>
        </div>
      </div>
    </section>
  );
};