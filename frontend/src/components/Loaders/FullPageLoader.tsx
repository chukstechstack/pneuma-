import React from "react";
import { Loader2 } from "lucide-react";

interface FullPageLoaderProps {
  message?: string;
  submessage?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message = "Pneuma Sanctuary",
  submessage = "Loading your life book...",
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#010102] flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.2)] animate-pulse">
        <Loader2 size={32} className="animate-spin text-[#d4af37]" />
      </div>
      <div className="text-center">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#d4af37] mb-1">
          {message}
        </h2>
        <p className="text-xs text-gray-500 font-mono tracking-wider">
          {submessage}
        </p>
      </div>
    </div>
  );
};