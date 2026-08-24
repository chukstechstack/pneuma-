import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0: Humanity, 1: The World (Red), 2: Pneuma, 3: Fade out
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Preload background images silently in the background
    const imagesToLoad = [
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485"
    ];

    imagesToLoad.forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    // Cinematic Timing Sequence
    const t1 = setTimeout(() => setPhase(1), 1400); // "The World" in Red
    const t2 = setTimeout(() => setPhase(2), 2800); // "Pneuma"
    const t3 = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => onComplete(), 900); // Trigger landing page & nav reveal
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#020205] text-white flex items-center justify-center p-6 md:p-12 text-center select-none transition-opacity duration-900 ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="max-w-[1200px] mx-auto w-full relative h-48 md:h-56 flex items-center justify-center">

        {/* Phase 0: Humanity (Clean White, Balanced Scale) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 transform px-4 ${phase === 0 ? "opacity-100 scale-100 filter blur-0" : "opacity-0 scale-95 filter blur-sm pointer-events-none"
            }`}
        >
          <span className="text-gray-500 font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase mb-3">
            // The Core
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
            Humanity.
          </h1>
        </div>

        {/* Phase 1: The World (CRISIS RED, Balanced Scale) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 transform px-4 ${phase === 1 ? "opacity-100 scale-100 filter blur-0" : "opacity-0 scale-95 filter blur-sm pointer-events-none"
            }`}
        >
          <span className="text-rose-500 font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase mb-3 animate-pulse">
         // THE FRACTURE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-rose-600 leading-none drop-shadow-[0_0_30px_rgba(225,29,72,0.4)]">
            The World.
          </h1>
        </div>

        {/* Phase 2: Pneuma (The Savior, Balanced Scale) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 transform px-4 ${phase === 2 ? "opacity-100 scale-100 filter blur-0" : "opacity-0 scale-105 filter blur-sm pointer-events-none"
            }`}
        >
          <span className="text-emerald-400 font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase mb-3 animate-pulse">
            //  THE QUICKENING.
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_50px_rgba(16,185,129,0.4)] leading-none">
            Pneuma.
          </h1>
          <p className="text-gray-400 font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase mt-3">
            THE BREATH OF RESCUE.
          </p>
        </div>

      </div>
    </div>
  );
};