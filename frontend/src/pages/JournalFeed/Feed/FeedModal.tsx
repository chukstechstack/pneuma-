import React from "react";
import { JournalTask } from "../Page.types";
import { Calendar, X } from "lucide-react";

interface JournalModalProps {
  task: JournalTask | null;
  onClose: () => void;
  isOwner: boolean;
  navigate: (path: string) => void;
  formatDate: (date?: string) => string;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  task,
  onClose,
  isOwner,
  navigate,
  formatDate,
}) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#09090b] border border-white/[0.12] rounded-3xl p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <Calendar size={16} />
            <span className="text-xs font-mono uppercase tracking-widest">{formatDate(task.created_at)}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-[#d4af37] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {task.img && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 max-h-72 bg-black">
            <img 
              src={task.img} 
              alt="Testimony media" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-gray-100 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal mb-8">
          {task.content}
        </p>

        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
          {isOwner && (
            <button
              onClick={() => {
                const id = task.uuid;
                onClose();
                navigate(`/patchfeed/${id}`);
              }}
              className="border border-[#d4af37]/60 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all rounded-xl cursor-pointer"
            >
              Modify Entry
            </button>
          )}
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-auto">Pneuma Sanctuary Scroll</span>
        </div>
      </div>
    </div>
  );
};