import React from "react";
import { Sparkles, ArrowUpRight } from "lucide-react";

interface JournalHeaderProps {
  isOwner: boolean;
  navigate: (path: string) => void;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({ isOwner, navigate }) => {
  return (
    <div className="mb-8 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#09090b] via-[#121008] to-[#09090b] border border-white/[0.08] relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[60px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 mb-3">
            <Sparkles size={12} className="text-[#d4af37]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] text-[#d4af37]">Sanctuary Archive</span>
          </div>
          
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide uppercase text-white mb-1.5">
            Journal Feed
          </h1>
          <p className="text-gray-400 text-xs sm:text-base max-w-xl leading-relaxed">
            Your secure collection of testimonies and milestones. <span className="hidden sm:inline">Preserving your life book page by page.</span>
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => navigate("/createtask")}
            className="self-start sm:self-auto border border-[#d4af37]/60 px-5 py-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <span>New Testimony</span>
            <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};