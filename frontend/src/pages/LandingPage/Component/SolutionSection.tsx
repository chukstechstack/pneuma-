import React, { useMemo } from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";

export const SolutionSection: React.FC = () => {
  const solutions = useMemo(() => {
    return PNEUMA_IMAGES.slice(15, 20).map((img) => ({
      ...img,
      optimizedUrl:
        img.url && img.url.includes("unsplash.com")
          ? `${img.url}?auto=format&fit=crop&w=1000&q=80`
          : img.url,
    }));
  }, []);

  return (
    <section
      id="solutions"
      className="py-16 md:py-28 bg-[#030305] text-white relative overflow-hidden"
    >
      {/* 1. SHOWROOM HEADLINE */}
      <div className="px-6 md:px-16 max-w-[1700px] mx-auto space-y-6 relative z-10 mb-12 md:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-end">
          <div className="lg:col-span-8 space-y-2">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9] select-none">
              OUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
                MISSION
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 space-y-3 lg:pl-6 border-l-0 lg:border-l border-emerald-500/20">
            <p className="text-emerald-300 font-serif italic text-base md:text-xl leading-snug">
              "Darkness cannot drive out darkness; only light can do that."
            </p>
            <p className="text-gray-300 font-sans text-xs sm:text-sm leading-relaxed">
              We do not wait for committees, permits, or corporate permission. Where there is pain, we deploy. Where there is isolation, we stand.
            </p>
          </div>
        </div>
      </div>

      {/* 2. STANDARD VERTICAL GRID (Replaced horizontal scroll trap with standard responsive cards) */}
      <div className="px-6 md:px-16 max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((img, idx) => (
            <div
              key={img.id || idx}
              className="relative w-full h-[400px] sm:h-[480px] rounded-xl overflow-hidden bg-[#070908] border border-white/10 flex flex-col justify-end"
            >
              {/* Standard Image Render (Clean brightness/contrast) */}
              <img
                src={img.optimizedUrl}
                alt={img.title || "Human Relief Mission"}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.75]"
              />

              {/* Standard Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent pointer-events-none" />

              {/* Number Watermark */}
              <div className="absolute top-5 right-6 text-4xl sm:text-6xl font-black text-white/15 select-none pointer-events-none">
                0{idx + 1}
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 p-6 sm:p-8 space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-none">
                  {img.title || "Direct Action"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed line-clamp-2">
                  {img.caption || "Standing on the ground alongside those in hardship to deliver tangible aid without delay."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};