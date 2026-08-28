import React, { useMemo } from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export const OutpostsSection: React.FC = () => {
  // Memoize card image array and downsample resolution to reduce decoding weight
  const outposts = useMemo(() => {
    const optimizeImg = (url: string, width = 800) => {
      if (!url) return "";
      if (url.includes("unsplash.com")) {
        return `${url}?auto=format&fit=crop&w=${width}&q=75`;
      }
      return url;
    };

    return PNEUMA_IMAGES.slice(3, 7).map((img, index) => ({
      ...img,
      optimizedUrl: optimizeImg(img.url, index === 0 ? 900 : 600),
    }));
  }, []);

  return (
    <section
      id="outposts"
      className="relative py-16 md:py-32 px-6 md:px-12 max-w-[1700px] mx-auto z-20 overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
        <div className="max-w-4xl">
          <h2 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase leading-[0.95]">
            PNEUMA
          </h2>
        </div>
        <div className="max-w-md border-l-2 border-emerald-500/30 pl-5 md:pl-6 py-1 md:py-2">
          <p className="text-sm sm:text-base md:text-lg text-gray-300 font-serif italic leading-relaxed">
            "The spirit gives life; the flesh counts for nothing."
          </p>
          <p className="text-gray-400 font-sans text-xs md:text-sm mt-2 md:mt-3 leading-relaxed">
            Where institutional systems fail and human breath falters, Pneuma moves. We are building active outposts, raising leaders in rural trenches, and bridging isolation with immediate, life-saving infrastructure.
          </p>
        </div>
      </div>

      {/* Asymmetric Bento Grid Gallery (Cleaned of heavy composite triggers) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        {/* Card 1 - Active Outpost */}
        {outposts[0] && (
          <div className="md:col-span-8 relative h-[380px] sm:h-[420px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d14]">
            <img
              src={outposts[0].optimizedUrl}
              alt={outposts[0].title || "Frontline Outpost"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-5 sm:p-6 md:p-10 flex flex-col justify-end pointer-events-none">
         
              <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-white uppercase tracking-wide mb-1.5 md:mb-3">
                {outposts[0].title || "Establishing The Base"}
              </h3>
              <p className="text-gray-300 font-sans text-xs sm:text-sm md:text-base max-w-xl leading-relaxed line-clamp-3">
                {outposts[0].caption || "We place physical hubs directly where conflict and crisis strike. No waiting for permission. We secure the perimeter and deploy help instantly."}
              </p>
            </div>
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center">
              <ArrowUpRight size={16} className="text-white" />
            </div>
          </div>
        )}

        {/* Card 2 - Community Leader */}
        {outposts[1] && (
          <div className="md:col-span-4 relative h-[380px] sm:h-[420px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d14]">
            <img
              src={outposts[1].optimizedUrl}
              alt={outposts[1].title || "Rural Sovereignty"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-5 sm:p-6 md:p-10 flex flex-col justify-end pointer-events-none">
             
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-1.5 md:mb-3">
                {outposts[1].title || "Voices In The Wilderness"}
              </h3>
              <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed line-clamp-3">
                {outposts[1].caption || "We empower voices on the ground to speak life back into broken regions. True recovery starts when community leaders are given the platform to guide their own people."}
              </p>
            </div>
          </div>
        )}

        {/* Card 3 - Network Link */}
        {outposts[2] && (
          <div className="md:col-span-5 relative h-[360px] sm:h-[400px] md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d14]">
            <img
              src={outposts[2].optimizedUrl}
              alt={outposts[2].title || "The Network Link"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-5 sm:p-6 md:p-10 flex flex-col justify-end pointer-events-none">
        
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-1.5">
                {outposts[2].title || "Tearing Down Isolation"}
              </h3>
              <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed line-clamp-3">
                {outposts[2].caption || "No one is out of reach. We place digital and physical anchors in forgotten sectors, connecting vulnerable souls to a global ecosystem of care."}
              </p>
            </div>
          </div>
        )}

        {/* Card 4 - Active Operations */}
        {outposts[3] && (
          <div className="md:col-span-7 relative h-[360px] sm:h-[400px] md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d14]">
            <img
              src={outposts[3].optimizedUrl}
              alt={outposts[3].title || "Active Operations"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent p-5 sm:p-6 md:p-10 flex flex-col justify-end pointer-events-none">
        
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-1.5">
                {outposts[3].title || "Sprinting Across The Chasm"}
              </h3>
              <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed line-clamp-3">
                {outposts[3].caption || "We don't stand at a distance and watch neighborhoods fall apart. Pneuma is the moving wind—we push into the crisis, bridge the gap, and build immediate sanctuaries."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};