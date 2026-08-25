import React, { useMemo } from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { Heart, ArrowUpRight } from "lucide-react";

export const WhoWeAre: React.FC = () => {
  // Memoize card images with proper resolution constraints
  const aboutCards = useMemo(() => {
    return PNEUMA_IMAGES.slice(7, 11).map((img) => ({
      ...img,
      optimizedUrl:
        img.url && img.url.includes("unsplash.com")
          ? `${img.url}?auto=format&fit=crop&w=800&q=75`
          : img.url,
    }));
  }, []);

  return (
    <section 
      id="about-us" 
      className="py-20 md:py-32 px-6 md:px-12 max-w-[1700px] mx-auto relative z-20 overflow-hidden transform-gpu"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Massive Sticky Header (Desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <span className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black tracking-[0.3em] uppercase bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            Section 04 // The Moral Line
          </span>
          
          <h2 className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter text-white uppercase leading-[0.88] select-none">
            WHO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
              WE ARE
            </span>
          </h2>

          <div className="border-l-2 border-emerald-500/40 pl-6 space-y-4 pt-2">
            <p className="text-lg md:text-xl text-gray-300 font-serif italic leading-relaxed">
              "A decentralized line of defense for human dignity."
            </p>
            <p className="text-gray-400 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
              Pneuma is not a company, a product, or a tech showcase. If a bomb falls, if a soul struggles in addiction, or if a community is left in darkness—we show up.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Asymmetric 2x2 Dynamic Card Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {aboutCards.map((img, idx) => {
            // Apply slight vertical offset on desktop for an asymmetric editorial feel
            const offsetClass = idx % 2 === 1 ? "sm:translate-y-8" : "";

            return (
              <div 
                key={img.id || idx} 
                className={`group relative h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d14] [transform:translateZ(0)] [backface-visibility:hidden] transition-transform duration-300 ${offsetClass}`}
              >
                {/* Background Image */}
                <img 
                  src={img.optimizedUrl} 
                  alt={img.title || "Who We Are"} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 group-hover:brightness-90 transition-all duration-500 ease-out" 
                />

                {/* Top Corner Badge */}
                <div className="absolute top-5 left-5 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-emerald-400 text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5">
                  <Heart size={12} className="fill-emerald-400/20" /> 0{idx + 1}
                </div>

                {/* Hover Arrow Icon */}
                <div className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight size={16} />
                </div>

                {/* Content Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/60 to-transparent p-6 sm:p-8 flex flex-col justify-end pointer-events-none">
                  <span className="text-emerald-400 text-[11px] font-black tracking-widest uppercase mb-1">
                    Sacred Duty
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2 leading-none">
                    {img.title}
                  </h3>
                  <p className="text-gray-300 font-sans text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {img.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};