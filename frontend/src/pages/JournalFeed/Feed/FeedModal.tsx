import React from "react";
import { JournalTask } from "../Page.types";
import { Calendar, X, BookOpen } from "lucide-react";

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

  const hasImage = Boolean(task.img);

  return (
    // Responsive Overlay: bottom sheet on mobile, centered modal on desktop
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Container: Side-by-side split if image exists, clean single-column if text-only */}
      <div 
        className={`w-full bg-[#09090b] border-t sm:border border-white/[0.12] rounded-t-3xl sm:rounded-3xl relative shadow-2xl overflow-hidden flex flex-col ${
          hasImage 
            ? "max-w-4xl max-h-[92vh] sm:max-h-[85vh]" 
            : "max-w-xl max-h-[85vh]"
        }`}
      >
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.08] bg-[#0c0c0e] shrink-0">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <Calendar size={15} />
            <span className="text-xs font-mono uppercase tracking-widest">{formatDate(task.created_at)}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-[#d4af37] transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dynamic Split Layout Body */}
        <div className={`flex flex-col ${hasImage ? "md:flex-row" : ""} overflow-y-auto flex-1`}>
          
          {/* Left Side: Media Pane (if image exists) */}
          {hasImage && (
            <div className="w-full md:w-1/2 bg-black/80 flex items-center justify-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/[0.08] min-h-[250px] md:min-h-[400px]">
              <img 
                src={task.img} 
                alt="Testimony media preview" 
                className="w-full h-full max-h-[50vh] md:max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          )}

          {/* Right Side: Content & Action Pane */}
          <div className={`flex flex-col justify-between flex-1 p-5 sm:p-8 ${hasImage ? "md:w-1/2" : "w-full"}`}>
            
            <div className="space-y-4">
              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-wider">
                <BookOpen size={14} />
                <span>Sanctuary Record</span>
              </div>

              {/* Scrollable Testimony Content */}
              <p className="text-gray-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
                {task.content}
              </p>
            </div>

            {/* Modal Footer (Modify Entry & Signature Stamp) */}
            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between shrink-0">
              {isOwner ? (
                <button
                  onClick={() => {
                    const id = task.uuid;
                    onClose();
                    navigate(`/patchfeed/${id}`);
                  }}
                  className="border border-[#d4af37]/60 px-3.5 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all rounded-xl cursor-pointer"
                >
                  Modify Entry
                </button>
              ) : <div />}

              <span className="text-[10px] sm:text-xs font-mono text-gray-500 uppercase tracking-widest">
                Pneuma Sanctuary Scroll
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};