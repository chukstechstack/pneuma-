import React, { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface TaskActionsMenuProps {
  taskUuid: string;
  onEdit: (uuid: string) => void;
  deleteTask: (uuid: string) => void;
}

export const TaskActionsMenu: React.FC<TaskActionsMenuProps> = ({
  taskUuid,
  onEdit,
  deleteTask,
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <div className="relative shrink-0 font-sans">
      {/* 3-Dot Options Trigger */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all bg-transparent border-none cursor-pointer"
        aria-label="More options"
      >
        <MoreHorizontal size={20} strokeWidth={2} />
      </button>

      {showMenu && (
        <>
          {/* Backdrop dimming overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] sm:bg-transparent z-40 transition-opacity" 
            onClick={() => setShowMenu(false)} 
          />

          {/* Desktop/Mobile Adaptive Container */}
          <div className="
            fixed bottom-0 left-0 right-0 w-full bg-[#1c1c1e] rounded-t-[24px] pb-8 pt-3 px-2 z-50 animate-in slide-in-from-bottom duration-200 shadow-2xl border-t border-white/10
            sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-9 sm:w-36 sm:bg-[#1c1c1e] sm:border sm:border-white/[0.08] sm:rounded-xl sm:shadow-2xl sm:py-1 sm:px-0 sm:overflow-hidden
          ">
            {/* Mobile Drag Indicator bar */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

            {/* Edit Option */}
            <button
              onClick={() => { setShowMenu(false); onEdit(taskUuid); }}
              className="w-full px-5 py-3.5 text-left text-sm font-medium text-white flex items-center gap-3 active:bg-white/5 transition-colors cursor-pointer border-b border-white/[0.06] sm:border-none sm:text-xs sm:py-2.5 sm:px-4 sm:hover:bg-white/5 sm:font-normal"
            >
              <Pencil size={16} className="text-white/60 sm:hidden" />
              <span>Edit</span>
            </button>

            {/* Delete Option */}
            <button
              onClick={() => { setShowMenu(false); deleteTask(taskUuid); }}
              className="w-full px-5 py-3.5 text-left text-sm font-semibold text-red-400 flex items-center gap-3 active:bg-white/5 transition-colors cursor-pointer sm:text-xs sm:py-2.5 sm:px-4 sm:hover:bg-red-500/10 sm:font-normal"
            >
              <Trash2 size={16} className="text-red-400 sm:hidden" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};