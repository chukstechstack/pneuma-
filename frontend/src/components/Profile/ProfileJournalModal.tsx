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

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#09090b] border border-white/[0.12] rounded-3xl p-6 sm:p-8 relative shadow-2xl max-h-[85vh] overflow-y-auto">
        
        {/* Modal Header */}
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

        {/* Full Image Preview - using object-contain to prevent cutting off heads/tops */}
        {task.img && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center max-h-[50vh]">
            <img 
              src={task.img} 
              alt="Modal preview" 
              className="w-full h-full max-h-[50vh] object-contain"
            />
          </div>
        )}

        {/* Modal Content */}
        <p className="text-gray-100 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal">
          {task.content}
        </p>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-gray-500 uppercase tracking-widest">
          <span>Pneuma Sanctuary Scroll</span>
          <span className="text-[#d4af37]">Verified</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileJournalModal;