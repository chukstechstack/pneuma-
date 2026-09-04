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
        onClick={(e) => {
          e.stopPropagation(); // Prevents bubbling to card clicks
          setShowMenu(!showMenu);
        }}
        className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all bg-transparent border-none cursor-pointer"
        aria-label="More options"
      >
        <MoreHorizontal size={20} strokeWidth={2} />
      </button>

      {showMenu && (
        <>
          {/* Backdrop dimming overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm sm:bg-transparent z-40 transition-opacity" 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
            }} 
          />

          {/* Desktop/Mobile Adaptive Container */}
          <div className="
            fixed bottom-0 left-0 right-0 w-full bg-[#121216] rounded-t-[28px] pb-10 pt-3 px-3 z-50 animate-in slide-in-from-bottom duration-200 shadow-2xl border-t border-white/10
            sm:absolute sm:bottom-auto sm:right-0 sm:top-12 sm:w-44 sm:bg-[#15151a] sm:border sm:border-white/10 sm:rounded-2xl sm:shadow-2xl sm:py-2 sm:px-1.5 sm:overflow-hidden
          ">
            {/* Mobile Drag Indicator bar */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

            {/* Edit Option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onEdit(taskUuid);
              }}
              className="w-full px-5 py-3.5 text-left text-sm font-medium text-white/90 flex items-center gap-3.5 active:bg-white/10 transition-colors cursor-pointer border-b border-white/[0.06] sm:border-none sm:text-xs sm:py-2.5 sm:px-3 sm:rounded-xl sm:hover:bg-white/10 sm:hover:text-white"
            >
              <Pencil size={16} className="text-white/60 sm:hidden" />
              <span className="font-medium">Edit post</span>
            </button>

            {/* Delete Option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                deleteTask(taskUuid);
              }}
              className="w-full px-5 py-3.5 text-left text-sm font-medium text-rose-400 flex items-center gap-3.5 active:bg-rose-500/10 transition-colors cursor-pointer sm:text-xs sm:py-2.5 sm:px-3 sm:rounded-xl sm:hover:bg-rose-500/15"
            >
              <Trash2 size={16} className="text-rose-400 sm:hidden" />
              <span>Delete post</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};