import React, { useMemo } from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";

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
      className="py-28 md:py-40 bg-[#030305] text-white relative overflow-hidden transform-gpu"
    >
      {/* Background Ambient Transition Glow (Red -> Emerald Shift) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* 1. MASSIVE SHOWROOM HEADLINE */}
      <div className="px-6 md:px-16 max-w-[1700px] mx-auto space-y-8 relative z-10 mb-20 md:mb-28">
        
        {/* Minimal Pill Badge */}

        {/* Huge Asymmetric Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-2">
            <span className="text-emerald-500 font-mono text-xs md:text-sm tracking-[0.3em] uppercase block">
              DIRECT INTERVENTION MATRIX
            </span>
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white uppercase leading-[0.85] select-none">
              OUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
                MISSION
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 space-y-4 lg:pl-6 border-l-0 lg:border-l border-emerald-500/20">
            <p className="text-emerald-300 font-serif italic text-lg md:text-xl leading-snug">
              "Darkness cannot drive out darkness; only light can do that."
            </p>
            <p className="text-gray-300 font-sans text-xs sm:text-sm leading-relaxed">
              We do not wait for committees, permits, or corporate permission. Where there is pain, we deploy. Where there is isolation, we stand. We break through red tape to restore life and human dignity.
            </p>
          </div>
        </div>
      </div>

      {/* 2. EDGE-TO-EDGE SHOWROOM EXHIBIT STRIP */}
      <div className="relative z-10 w-full overflow-x-auto scrollbar-none pb-8 px-6 md:px-16 [transform:translateZ(0)]">
        <div className="flex gap-8 md:gap-12 min-w-max">
          {solutions.map((img, idx) => (
            <div
              key={img.id || idx}
              className="group relative w-[320px] sm:w-[420px] md:w-[480px] h-[520px] sm:h-[600px] rounded-3xl overflow-hidden bg-[#070908] [transform:translateZ(0)] shrink-0"
            >
              {/* Exhibit Image Canvas */}
              <img
                src={img.optimizedUrl}
                alt={img.title || "Human Relief Mission"}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover brightness-[0.85] contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Seamless Dark Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent opacity-90" />

              {/* Number Watermark */}
              <div className="absolute top-6 right-8 text-5xl sm:text-7xl font-black text-white/10 select-none pointer-events-none">
                0{idx + 1}
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none space-y-3">
                <span className="text-emerald-400 text-xs font-mono font-bold tracking-[0.25em] uppercase flex items-center gap-2">
                  <HeartHandshake size={14} /> COVENANT // {img.category || "DIRECT RELIEF"}
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-none">
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
      <div className="px-6 md:px-16 max-w-[1700px] mx-auto mt-6 flex justify-end">
        <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-widest flex items-center gap-2">
          SWIPE EXHIBITS <ArrowRight size={12} />
        </span>
      </div>
    </section>
  );
};