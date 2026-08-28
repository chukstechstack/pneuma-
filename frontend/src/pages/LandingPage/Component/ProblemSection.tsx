import React, { useMemo } from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";

export const ProblemSection: React.FC = () => {
  const { featuredProblem, subProblems } = useMemo(() => {
    const optimizeImg = (url: string, width = 1200) => {
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
        ? { ...rawFeatured, optimizedUrl: optimizeImg(rawFeatured.url, 1400) }
        : null,
      subProblems: rawSub.map((img) => ({
        ...img,
        optimizedUrl: optimizeImg(img.url, 1000),
      })),
    };
  }, []);

  return (
    <section className="w-full bg-[#030305] text-white relative overflow-hidden">
      
      {/* 1. STABILIZED EXHIBIT CONTAINER (Swapped volatile vh for fixed responsive heights) */}
      <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] flex flex-col justify-end p-6 sm:p-10 md:p-16 overflow-hidden transform-gpu">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 bg-[#030305] overflow-hidden">
          {featuredProblem?.optimizedUrl && (
            <img
              src={featuredProblem.optimizedUrl}
              alt="Earth and Medical Logistics"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center brightness-90 contrast-110 transform-gpu"
            />
          )}
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#030305_90%)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030305] to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030305] to-transparent pointer-events-none" />
        </div>

        {/* Floating Minimalist Headline */}
        <div className="relative z-10 max-w-3xl space-y-2 sm:space-y-3 mb-4 md:mb-6">
          <span className="text-rose-500 text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block">
            {featuredProblem?.location || "ORBITAL TO FRONTLINE"}
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.95] select-none">
            WHEN THE WORLD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-300 to-white">
              LOOKS AWAY
            </span>
          </h1>

          <p className="text-gray-300 font-sans text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
            {featuredProblem?.caption ||
              "Essential medicines exist, but institutional pipelines fail before reaching the perimeter. We deploy direct supply lines across the divide."}
          </p>
        </div>
      </div>

      {/* 2. SHOWROOM GALLERY EXHIBITS */}
      <div className="max-w-[1700px] mx-auto py-16 md:py-36 px-6 md:px-12 space-y-20 md:space-y-36 relative z-10">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
            WHERE THE SYSTEM <span className="text-rose-500">FAILS</span>
          </h2>
        </div>

        <div className="space-y-16 md:space-y-32">
          {subProblems.map((img, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={img.id || idx}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-6 lg:gap-16 items-center`}
              >
                <div className="w-full lg:w-8/12 h-[350px] sm:h-[450px] md:h-[550px] relative bg-transparent overflow-hidden rounded-2xl lg:rounded-none border border-white/10">
                  <img
                    src={img.optimizedUrl}
                    alt={img.title || "Crisis Exhibit"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover brightness-[0.85] contrast-105 transform-gpu"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent opacity-90 pointer-events-none" />
                  
                  <div className="absolute top-6 left-6 text-5xl md:text-8xl font-black text-white/10 select-none pointer-events-none z-10">
                    0{idx + 1}
                  </div>
                </div>

                <div className="w-full lg:w-4/12 space-y-3">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
                    {img.title || "Human Struggle"}
                  </h3>
                  <p className="text-gray-300 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
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