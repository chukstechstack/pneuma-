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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className={`w-full bg-[#ffffff] border border-gray-200 rounded-[24px] sm:rounded-[32px] relative shadow-2xl overflow-hidden flex flex-col ${
          hasImage 
            ? "max-w-3xl max-h-[85vh] md:max-h-[80vh]" 
            : "max-w-md max-h-[75vh]"
        }`}
      >
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-100 bg-gray-50 shrink-0">
          <div className="flex items-center gap-1.5 text-[#fe2c55]">
            <Calendar size={14} />
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold">{formatDate(task.created_at)}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:text-[#161823] hover:border-[#fe2c55] transition-all cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Dynamic Body Layout */}
        <div className={`flex flex-col ${hasImage ? "md:flex-row" : ""} overflow-y-auto flex-1`}>
          
          {/* Left Side: Image Display */}
          {hasImage && (
            <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-3 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 min-h-[220px] md:min-h-[350px]">
              <img 
                src={task.img} 
                alt="Journal media preview" 
                className="w-full h-full max-h-[45vh] md:max-h-[65vh] object-contain rounded-xl shadow-sm"
              />
            </div>
          )}

          {/* Right Side: Content & Details Pane */}
          <div className={`flex flex-col justify-between flex-1 p-5 sm:p-7 ${hasImage ? "md:w-1/2" : "w-full"}`}>
            
            <div className="space-y-3">
              <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-[#fe2c55] uppercase tracking-wider font-bold">
                <BookOpen size={13} />
                <span>Sanctuary Record</span>
              </div>

              {/* Scrollable Text Content */}
              <p className="text-[#161823] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                {task.content}
              </p>
            </div>

            {/* Modal Footer Stamp */}
            <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-widest shrink-0">
              <span className="text-[#fe2c55] font-bold">Verified</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfileJournalModal;