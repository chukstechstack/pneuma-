import React from "react";
import { Sparkles, ArrowUpRight } from "lucide-react";

interface JournalHeaderProps {
  isOwner: boolean;
  navigate: (path: string) => void;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({ isOwner, navigate }) => {
  return (
    <div className="mb-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#09090b] via-[#121008] to-[#09090b] border border-white/[0.08] relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[60px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 mb-4">
            <Sparkles size={14} className="text-[#d4af37]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37]">Personal Sanctuary Archive</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide uppercase text-white mb-2">
            Your Journal Feed
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed">
            Your secure collection of testimonies, prayers, and written milestones. Preserving your life book page by page.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => navigate(`/patchfeed/new`)}
            className="self-start sm:self-auto border border-[#d4af37]/60 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <span>New Testimony</span>
            <ArrowUpRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};