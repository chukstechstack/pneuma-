import React from "react";
import { JournalTask } from "../Page.types";
import { JournalCardInteractions } from "../JournalCardInteractions";
import { Sparkles } from "lucide-react";

interface JournalGridProps {
  tasks: JournalTask[];
  onSelectTask: (task: JournalTask) => void;
  formatDate: (date?: string) => string;
}

export const JournalGrid: React.FC<JournalGridProps> = ({ tasks, onSelectTask, formatDate }) => {
  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 text-xs sm:text-sm font-sans tracking-wider">
          No record
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
      {tasks.map((task) => {
        const { uuid, content, created_at, img } = task;
        return (
          <div 
            key={uuid} 
            onClick={() => onSelectTask(task)}
            // TikTok-style vertical proportion: h-64 on mobile, h-80 on desktop
            className="group relative h-64 sm:h-80 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-[#09090b] cursor-pointer shadow-lg hover:border-[#d4af37] transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between p-2.5 sm:p-4"
          >
            {img ? (
              <img
                src={img}
                alt="journal testimony"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#121008] to-[#010102] p-4 flex items-center justify-center text-center">
                <Sparkles size={22} className="text-[#d4af37]/40" />
              </div>
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

            {/* Top Date Badge */}
            <div className="relative z-10 flex justify-end">
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-sans text-[#d4af37]">
                {formatDate(created_at)}
              </span>
            </div>

            {/* Bottom Content Preview */}
            <div className="relative z-10 mt-auto">
              <p className="text-[11px] sm:text-sm text-gray-200 line-clamp-2 sm:line-clamp-3 font-sans font-medium group-hover:text-white transition-colors">
                {content}
              </p>
            </div>

            {/* Bottom Interaction Badges */}
            <div className="relative z-10">
              <JournalCardInteractions taskUuid={uuid} />
            </div>
          </div>
        );
      })}
    </div>
  );
};