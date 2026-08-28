import React from "react";
import { Calendar, X, BookOpen } from "lucide-react";

type Task = {
  uuid: string;
  content: string;
  created_at: string;
  img?: string;
};

type ProfileJournalModalProps = {
  task: Task | null;
  onClose: () => void;
};

export const ProfileJournalModal: React.FC<ProfileJournalModalProps> = ({ task, onClose }) => {
  if (!task) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const hasImage = Boolean(task.img);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className={`w-full bg-[#09090b] border border-white/[0.12] rounded-3xl relative shadow-2xl overflow-hidden flex flex-col ${
          hasImage 
            ? "max-w-4xl max-h-[90vh] md:max-h-[80vh]" 
            : "max-w-xl max-h-[85vh]"
        }`}
      >
        
        {/* Modal Top Bar (Shared Header) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0c0c0e] shrink-0">
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

        {/* Dynamic Body Layout: Side-by-Side if Image exists, Single column if text-only */}
        <div className={`flex flex-col ${hasImage ? "md:flex-row" : ""} overflow-y-auto flex-1`}>
          
          {/* Left Side: Image Display (LinkedIn Style Media Pane) */}
          {hasImage && (
            <div className="w-full md:w-1/2 bg-black/80 flex items-center justify-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/[0.08] min-h-[250px] md:min-h-[400px]">
              <img 
                src={task.img} 
                alt="Journal media preview" 
                className="w-full h-full max-h-[50vh] md:max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          )}

          {/* Right Side: Content & Details Pane */}
          <div className={`flex flex-col justify-between flex-1 p-6 sm:p-8 ${hasImage ? "md:w-1/2" : "w-full"}`}>
            
            <div className="space-y-4">
              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-wider">
                <BookOpen size={14} />
                <span>Sanctuary Record</span>
              </div>

              {/* Scrollable Text Content */}
              <p className="text-gray-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
                {task.content}
              </p>
            </div>

            {/* Modal Footer Stamp */}
            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] sm:text-xs font-mono text-gray-500 uppercase tracking-widest shrink-0">
              <span>Pneuma Sanctuary Scroll</span>
              <span className="text-[#d4af37]">Verified</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfileJournalModal;