import React, { useMemo } from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { ShieldAlert, HeartHandshake } from "lucide-react";

export const ProblemSection: React.FC = () => {
  const { featuredProblem, subProblems } = useMemo(() => {
    const optimizeImg = (url: string, width = 1600) => {
      if (!url) return "";
      if (url.includes("unsplash.com")) {
        return `${url}?auto=format&fit=crop&w=${width}&q=80`;
      }
      return url;
    };

    const rawFeatured =
      PNEUMA_IMAGES.find((img) => img.id === 12) ||
      PNEUMA_IMAGES[11] ||
      PNEUMA_IMAGES[0];

    const rawSub = PNEUMA_IMAGES.filter((img) => [13, 14, 15].includes(img.id));

    return {
      featuredProblem: rawFeatured
        ? { ...rawFeatured, optimizedUrl: optimizeImg(rawFeatured.url, 1800) }
        : null,
      subProblems: rawSub.map((img) => ({
        ...img,
        optimizedUrl: optimizeImg(img.url, 1200),
      })),
    };
  }, []);

  return (
    <section className="w-full bg-[#030305] text-white relative overflow-hidden transform-gpu">
      
      {/* 1. CINEMATIC FULL-SCREEN EXHIBIT (EARTH + TRUCK) */}
      <div className="relative w-full h-screen flex flex-col justify-between p-6 sm:p-10 md:p-16 [transform:translateZ(0)]">
        
        {/* Unobstructed Earth/Space Medical Truck Background */}
        <div className="absolute inset-0 z-0 bg-[#030305]">
          {featuredProblem?.optimizedUrl && (
            <img
              src={featuredProblem.optimizedUrl}
              alt="Earth and Medical Logistics"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-center brightness-100 contrast-110 [backface-visibility:hidden]"
            />
          )}
          
          {/* Organic Edge Melting into Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030305_85%)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#030305] via-[#030305]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030305] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030305] to-transparent pointer-events-none" />
        </div>

        {/* Minimal Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-black tracking-[0.3em] uppercase bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ShieldAlert size={14} className="text-rose-500 animate-pulse" />
            SECTION 04 // CRISIS LOGISTICS
          </div>
        </div>

        {/* Floating Minimalist Headline */}
        <div className="relative z-10 max-w-3xl space-y-3 mb-10">
          <span className="text-rose-500 text-xs font-mono tracking-[0.3em] uppercase block">
            {featuredProblem?.location || "ORBITAL TO FRONTLINE"}
          </span>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.88] select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            WHEN THE WORLD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-300 to-white">
              LOOKS AWAY
            </span>
          </h1>

          <p className="text-gray-300 font-sans text-xs sm:text-sm md:text-base max-w-xl leading-relaxed drop-shadow-md">
            {featuredProblem?.caption ||
              "Essential medicines exist, but institutional pipelines fail before reaching the perimeter. We deploy direct supply lines across the divide."}
          </p>
        </div>
      </div>

      {/* 2. SHOWROOM GALLERY EXHIBITS (BORDERLESS / SEAMLESS BLEED) */}
      <div className="max-w-[1700px] mx-auto py-24 md:py-36 px-6 md:px-12 space-y-24 md:space-y-36 relative z-10">
        
        {/* Section Title */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 text-rose-400 text-xs font-black tracking-[0.3em] uppercase bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
            <HeartHandshake size={14} /> Ground Evidence
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
            WHERE THE SYSTEM <span className="text-rose-500">FAILS</span>
          </h2>
        </div>

        {/* Showroom Exhibits: Pure Borderless Image Bleed */}
        <div className="space-y-20 md:space-y-32">
          {subProblems.map((img, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={img.id || idx}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 lg:gap-16 items-center`}
              >
                {/* Borderless Image Canvas with Multi-Side Fade */}
                <div className="w-full lg:w-8/12 h-[450px] sm:h-[550px] md:h-[650px] relative group bg-transparent [transform:translateZ(0)]">
                  <img
                    src={img.optimizedUrl}
                    alt={img.title || "Crisis Exhibit"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover brightness-[0.85] contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Heavy Edge Dissolve Overlays (Erases all harsh borders into the dark background) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent opacity-95 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#030305] via-transparent to-[#030305] opacity-80 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#030305] via-transparent to-[#030305] opacity-80 pointer-events-none" />
                  
                  {/* Floating Index Overlay */}
                  <div className="absolute top-8 left-8 text-6xl md:text-8xl font-black text-white/20 select-none pointer-events-none z-10">
                    0{idx + 1}
                  </div>
                </div>

                {/* Minimal Editorial Text Block */}
                <div className="w-full lg:w-4/12 space-y-4">
                  <span className="text-rose-500 text-xs font-mono tracking-[0.25em] uppercase block">
                    EXHIBIT // {img.location || "FRONT ZONE"}
                  </span>
                  
                  <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                    {img.title || "Human Struggle"}
                  </h3>

                  <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed">
                    {img.caption || "Communities pushed to the brink when basic necessities and emergency support fail to arrive."}
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