import React from "react";
import { Loader2 } from "lucide-react";

interface JournalPaginationProps {
  isFetchingNextPage: boolean;
  loadMoreRef: (node?: Element | null) => void;
}

export const JournalPagination: React.FC<JournalPaginationProps> = ({ isFetchingNextPage, loadMoreRef }) => {
  return (
    <div ref={loadMoreRef} className="py-10 flex justify-center items-center">
      {isFetchingNextPage && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#09090b] border border-white/10 text-xs font-mono text-[#d4af37] tracking-widest uppercase shadow-lg">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading more scrolls...</span>
        </div>
      )}
    </div>
  );
};