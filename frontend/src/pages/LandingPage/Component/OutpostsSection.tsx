import React from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { MapPin } from "lucide-react";

export const OutpostsSection: React.FC = () => {
  const [outpostRef] = useScrollReveal(0.1);
  const outposts = PNEUMA_IMAGES.slice(3, 7);

  return (
    <section id="outposts" ref={outpostRef} className="py-40 px-6 md:px-12 max-w-[1700px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-rose-400 text-xs font-bold tracking-[0.3em] uppercase">Sector 03 // Surveillance</span>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-white uppercase mt-2">Rural Collapse Sectors</h2>
        </div>
        <p className="text-gray-400 font-sans max-w-md text-sm">
          Decentralized logging from abandoned nodes where traditional connectivity failed completely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {outposts[0] && (
          <div className="md:col-span-8 relative h-[500px] rounded-3xl overflow-hidden border border-white/15 group shadow-2xl">
            <img src={outposts[0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-8 flex flex-col justify-end">
              <span className="text-rose-400 text-xs tracking-widest uppercase mb-2 flex items-center gap-1.5">
                <MapPin size={12} /> {outposts[0].location}
              </span>
              <h3 className="text-3xl font-bold text-white mb-2">{outposts[0].title}</h3>
              <p className="text-gray-300 font-sans text-sm max-w-xl">{outposts[0].caption}</p>
            </div>
          </div>
        )}

        {outposts[1] && (
          <div className="md:col-span-4 relative h-[500px] rounded-3xl overflow-hidden border border-white/15 group shadow-2xl">
            <img src={outposts[1].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-8 flex flex-col justify-end">
              <span className="text-rose-400 text-xs tracking-widest uppercase mb-2 flex items-center gap-1.5">
                <MapPin size={12} /> {outposts[1].location}
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">{outposts[1].title}</h3>
              <p className="text-gray-300 font-sans text-xs">{outposts[1].caption}</p>
            </div>
          </div>
        )}

        {outposts[2] && (
          <div className="md:col-span-5 relative h-[380px] rounded-3xl overflow-hidden border border-white/15 group shadow-2xl">
            <img src={outposts[2].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-8 flex flex-col justify-end">
              <span className="text-rose-400 text-xs tracking-widest uppercase mb-2">{outposts[2].location}</span>
              <h3 className="text-2xl font-bold text-white mb-1">{outposts[2].title}</h3>
            </div>
          </div>
        )}

        {outposts[3] && (
          <div className="md:col-span-7 relative h-[380px] rounded-3xl overflow-hidden border border-white/15 group shadow-2xl">
            <img src={outposts[3].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent p-8 flex flex-col justify-end">
              <span className="text-rose-400 text-xs tracking-widest uppercase mb-2">{outposts[3].location}</span>
              <h3 className="text-2xl font-bold text-white mb-1">{outposts[3].title}</h3>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};