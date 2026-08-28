import React, { useMemo } from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { HeartHandshake, ArrowRight } from "lucide-react";

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
      className="py-20 md:py-40 bg-[#030305] text-white relative overflow-hidden"
    >
      {/* Background Ambient Transition Glow (Static positioning) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-[120px] pointer-events-none" />

      {/* 1. SHOWROOM HEADLINE */}
      <div className="px-6 md:px-16 max-w-[1700px] mx-auto space-y-6 relative z-10 mb-16 md:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-end">
          <div className="lg:col-span-8 space-y-2">

            <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white uppercase leading-[0.9] select-none">
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

      {/* 2. BUTTERY-SMOOTH HORIZONTAL CAROUSEL STRIP */}
      <div className="relative z-10 w-full overflow-x-auto touch-pan-x [-webkit-overflow-scrolling:touch] scrollbar-none pb-6 px-6 md:px-16">
        <div className="flex gap-6 md:gap-12 min-w-max">
          {solutions.map((img, idx) => (
            <div
              key={img.id || idx}
              className="group relative w-[300px] sm:w-[420px] md:w-[480px] h-[480px] sm:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#070908] shrink-0 border border-white/10"
            >
              {/* Exhibit Image Canvas (Stable rendering with zero hover jitter) */}
              <img
                src={img.optimizedUrl}
                alt={img.title || "Human Relief Mission"}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover brightness-[0.8] contrast-105"
              />

              {/* Seamless Dark Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent opacity-95 pointer-events-none" />

              {/* Number Watermark */}
              <div className="absolute top-5 right-6 text-4xl sm:text-7xl font-black text-white/10 select-none pointer-events-none">
                0{idx + 1}
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end pointer-events-none space-y-2 sm:space-y-3">
      

                <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight leading-none">
                  {img.title || "Direct Action"}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed line-clamp-3">
                  {img.caption || "Standing on the ground alongside those in hardship to deliver tangible aid without delay."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll Hint */}
      <div className="px-6 md:px-16 max-w-[1700px] mx-auto mt-4 flex justify-end">
        <span className="text-[14px] font-mono text-emerald-400/80 uppercase tracking-widest flex items-center gap-2">
          SWIPE EXHIBIT <ArrowRight size={15} />
        </span>
      </div>
    </section>
  );
};