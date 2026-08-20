import React from "react";
import { PNEUMA_IMAGES } from "../Assets/pneumaImages";
import { useScrollReveal } from "../hooks/useScrollReveal";

export const ArchivesSection: React.FC = () => {
  const [archivesRef] = useScrollReveal(0.1);
  const archives = PNEUMA_IMAGES.slice(15, 20);

  return (
    <section id="archives" ref={archivesRef} className="py-40 px-6 md:px-12 max-w-[1700px] mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-rose-400 text-xs font-bold tracking-[0.3em] uppercase">Sector 06 // Permanent Records</span>
        <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-white uppercase mt-3 mb-4">The Archival Vault</h2>
        <p className="text-gray-400 font-sans text-sm">Encrypted state backups and historical data logs preserved across nodes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {archives.map((img, idx) => {
          const heightClass = idx % 2 === 0 ? "h-[420px] lg:translate-y-4" : "h-[360px] lg:-translate-y-6";

          return (
            <div 
              key={img.id} 
              className={`relative rounded-3xl overflow-hidden border border-white/15 group shadow-xl transition-all duration-500 ${heightClass}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/30 to-transparent p-6 flex flex-col justify-end">
                <span className="text-rose-400 text-[10px] tracking-widest uppercase mb-1">Vault 0{idx + 1}</span>
                <h3 className="text-base font-bold text-white mb-1 leading-snug">{img.title}</h3>
                <span className="text-[10px] text-gray-400 font-sans">{img.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};