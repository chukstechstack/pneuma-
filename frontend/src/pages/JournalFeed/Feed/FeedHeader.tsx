import React from "react";
import { ArrowUpRight } from "lucide-react";

interface JournalHeaderProps {
  isOwner: boolean;
  navigate: (path: string) => void;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({ isOwner, navigate }) => {
  return (
    <div className="mb-4 sm:mb-6 px-1 sm:p-6 sm:rounded-3xl sm:bg-gradient-to-r sm:from-[#09090b] sm:via-[#121008] sm:to-[#09090b] sm:border sm:border-white/[0.08] relative overflow-hidden flex items-center justify-between gap-3 w-full box-border">
      
      {/* Modern Sans-Serif Title & Subtext */}
      <div className="space-y-0.5">
        <h1 className="font-sans text-xl sm:text-3xl font-bold tracking-tight uppercase text-white">
          Archive
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm font-sans">
          Sanctuary records & testimonies
        </p>
      </div>

      {/* Action Button */}
      {isOwner && (
        <button
          onClick={() => navigate("/createtask")}
          className="hidden sm:flex border border-[#d4af37]/60 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 rounded-xl items-center gap-2 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
        >
          <span>New Testimony</span>
          <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
};