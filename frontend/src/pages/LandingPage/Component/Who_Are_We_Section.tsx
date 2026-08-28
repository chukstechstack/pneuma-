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
      className="py-16 md:py-32 px-6 md:px-12 max-w-[1700px] mx-auto relative z-20 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Static flow on mobile & desktop to prevent sticky jitter */}
        <div className="lg:col-span-5 space-y-5 md:space-y-6">
  
          
          <h2 className="text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter text-white uppercase leading-[0.9] select-none">
            WHO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
              WE ARE
            </span>
          </h2>

          <div className="border-l-2 border-emerald-500/40 pl-5 md:pl-6 space-y-3 md:space-y-4 pt-2">
            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-serif italic leading-relaxed">
              "A decentralized line of defense for human dignity."
            </p>
            <p className="text-gray-400 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
              Pneuma is not a company, a product, or a tech showcase. If a bomb falls, if a soul struggles in addiction, or if a community is left in darkness—we show up.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Clean, stable card grid with zero layout shift */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {aboutCards.map((img, idx) => {
            return (
              <div 
                key={img.id || idx} 
                className="group relative h-[400px] sm:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d14]"
              >
                {/* Background Image (Removed heavy hover scale to stop GPU composite jitter) */}
                <img 
                  src={img.optimizedUrl} 
                  alt={img.title || "Who We Are"} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover brightness-[0.7] group-hover:brightness-90 transition-all duration-300 ease-out" 
                />

                {/* Top Corner Badge (Solid background instead of backdrop-blur for zero jitter) */}
        

                {/* Hover Arrow Icon */}
                <div className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight size={16} />
                </div>

                {/* Content Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/60 to-transparent p-6 sm:p-8 flex flex-col justify-end pointer-events-none">
     
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