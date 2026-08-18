import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, MoreHorizontal, UserPlus, UserCheck } from "lucide-react";
import { useConnectionMutation } from "@hooks/useConnections.js";

interface TaskHeaderProps {
  task: {
    uuid: string;
    author_name?: string | null;
    author_profile_uuid: string;
    relation_status?: string | null;
    created_at?: string | null;
  };
  isOwner: boolean;
  currentUserUuid: string;
  onEdit: (uuid: string) => void;
  deleteTask: (uuid: string) => void;
  fallbackUserAvatar: string;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  isOwner,
  currentUserUuid,
  onEdit,
  deleteTask,
  fallbackUserAvatar,
}) => {
  const { uuid, author_name, author_profile_uuid, relation_status, created_at } = task;
  const { mutate: toggleConnection } = useConnectionMutation(author_profile_uuid);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const formatTaskDate = (rawDateString: string | null | undefined): string => {
    if (!rawDateString) return "Now";
    const dateObj: Date = new Date(rawDateString);
    const now: Date = new Date();
    const seconds: number = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  return (
    // Items center ensures everything aligns perfectly with the smaller avatar
    <div className="flex items-center justify-between gap-3 mb-5 relative">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${author_profile_uuid}`} className="relative block shrink-0">
          {/* Premium smaller avatar: 9 -> 8 (32px) */}
          <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10">
            <img 
              src={fallbackUserAvatar} 
              alt="profile" 
              className="w-full h-full object-cover" 
            />
          </div>
        </Link>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${author_profile_uuid}`} className="font-semibold text-white text-sm hover:text-[#d4af37] transition-colors">
              {author_name || "Sanctuary User"}
            </Link>
            {currentUserUuid !== author_profile_uuid && (
              <>
                <span className="text-white/20 font-light">·</span>
                <button
                  onClick={() => {
                    const action = relation_status === "active" || relation_status === "pending" ? "disconnect" : "connect";
                    toggleConnection(action as unknown as any);
                  }}
                  className={`text-xs font-medium transition-colors ${
                    relation_status === "active" 
                      ? "text-white/60 hover:text-red-400" 
                      : relation_status === "pending" 
                      ? "text-white/40 italic"
                      : "text-[#d4af37] hover:text-[#e5c05e]"
                  }`}
                >
                  {relation_status === "active" && "Following"}
                  {relation_status === "pending" && "Pending"}
                  {(!relation_status || relation_status === "none") && "Follow"}
                </button>
              </>
            )}
          </div>
          
          {/* Tighter timestamp */}
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Clock3 size={10} />
            <span>{formatTaskDate(created_at)}</span>
          </div>
        </div>
      </div>

      {isOwner && (
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
                  onClick={() => { setShowMenu(false); onEdit(uuid); }}
                  className="w-full px-4 py-2 text-left text-xs text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button 
                  onClick={() => { setShowMenu(false); deleteTask(uuid); }} 
                  className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};