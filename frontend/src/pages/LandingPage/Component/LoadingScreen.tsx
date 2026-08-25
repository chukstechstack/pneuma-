import React, { useEffect, useState } from "react";
import { preloadPriorityImages } from "../Assets/pneumaImages";
import { Terminal } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. Preload high-priority images behind the scenes
    preloadPriorityImages();

    // 2. Strict 1-second pulse timer before fading out smoothly
    const timer = setTimeout(() => {
      setIsFading(true);
      const fadeTimer = setTimeout(() => {
        onComplete();
      }, 300); // 300ms fade transition out
      return () => clearTimeout(fadeTimer);
    }, 1000); // Exactly 1 second duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#020205] text-white flex items-center justify-center p-6 text-center select-none transition-opacity duration-300 ease-out transform-gpu ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        
        {/* Pulsing Terminal Dot / Icon */}
        <div className="w-10 h-10 border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center animate-pulse">
          <Terminal size={18} className="text-emerald-400" />
        </div>

        {/* Brand Flash */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono tracking-[0.4em] text-emerald-400 uppercase animate-pulse">
            // INITIALIZING SECURE LINK
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Pneuma
          </h1>
        </div>

      </div>
    </div>
  );
};