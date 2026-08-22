import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, MoreHorizontal } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { toggleFollowStatus } from "../../hooks/followsSlice";

interface TaskHeaderProps {
  task: {
    uuid: string;
    author_name?: string | null;
    author_profile_uuid: string;
    created_at?: string | null;
    author_avatar_url?: string | null;
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
  const { uuid, author_name, author_profile_uuid, created_at, author_avatar_url, } = task;
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const dispatch = useDispatch();

  // 🔍 1. Checks if the author's card exists inside your Redux storage object
  const isFollowing = useSelector(
    (state: RootState) => !!state.follows.followingStatus[author_profile_uuid]
  );

  // 📦 2. Packs up the whole user details box and hands it to the dispatcher!
  const handleToggleFollow = () => {
    dispatch(
      toggleFollowStatus({
        uuid: author_profile_uuid,
        full_name: author_name || "Sanctuary User",
        avatar_url: author_avatar_url || fallbackUserAvatar,
      })
    );
  };

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
    <div className="flex items-center justify-between gap-3 mb-5 relative">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${author_profile_uuid}`} className="relative block shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10">
            <img
              src={author_avatar_url || fallbackUserAvatar}
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
                  onClick={handleToggleFollow}
                  className={`text-xs font-medium transition-colors cursor-pointer ${isFollowing
                      ? "text-emerald-400 hover:text-red-400"  // 👉 Green when connected
                      : "text-[#d4af37] hover:text-[#e5c05e]"   // 👉 Gold/Yellow when not connected
                    }`}
                >
                  {/* ✨ 3. Fixed labels: Shows Connected when true, Connect when false */}
                  {isFollowing ? "Connected" : "Connect"}
                </button>
              </>
            )}
          </div>

          {/* Date & Time with clean, subtle muted styling */}
          <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
            <Clock3 size={11} className="text-white/30" />
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