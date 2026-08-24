import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";

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
    <div className="relative shrink-0">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-8 h-8 rounded-full grid place-content-center text-white/30 hover:text-white/80 hover:bg-white/5 transition-all cursor-pointer"
      >
        <MoreHorizontal size={16} />
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-9 w-32 bg-[#18181c] border border-white/10 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
            <button
              onClick={() => { setShowMenu(false); onEdit(taskUuid); }}
              className="w-full px-4 py-2 text-left text-xs text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => { setShowMenu(false); deleteTask(taskUuid); }}
              className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};