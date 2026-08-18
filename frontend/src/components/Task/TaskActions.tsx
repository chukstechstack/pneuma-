import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface TaskActionsProps {
  uuid: string;
  is_liked?: boolean;
  is_reposted?: boolean;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  handle_Like_Reply_Share_Interaction: (uuid: string, action: string) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  uuid,
  is_liked,
  is_reposted,
  likes_count,
  comments_count,
  reposts_count,
  handle_Like_Reply_Share_Interaction,
}) => {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(
    (localStorage.getItem("active_drawer") as string) || null,
  );

  const defaultActionClass = "text-white/40";
  const textCounterClass = "text-xs font-medium";

  return (
    <div className="flex items-center gap-8 pt-3 pb-2 sm:pb-0 border-t border-white/[0.04] mt-4">
      
      {/* Like Button */}
      <button
        onClick={() => handle_Like_Reply_Share_Interaction(uuid, "like")}
        className={`flex items-center gap-2 transition-colors cursor-pointer group ${
          is_liked ? "text-rose-500" : `hover:text-white ${defaultActionClass}`
        }`}
      >
        <Heart 
          size={18} 
          strokeWidth={1.5}
          className={`transition-transform duration-200 group-hover:scale-110 ${
            is_liked ? "fill-rose-500 text-rose-500" : ""
          }`} 
        />
        <span className={textCounterClass}>{likes_count || 0}</span>
      </button>

      {/* Comment Button */}
      <button
        onClick={() => {
          const nextState = openDrawerId === uuid ? null : uuid;
          setOpenDrawerId(nextState);
          nextState ? localStorage.setItem("active_drawer", uuid) : localStorage.removeItem("active_drawer");
        }}
        className={`flex items-center gap-2 hover:text-white transition-colors cursor-pointer group ${defaultActionClass}`}
      >
        <MessageCircle size={18} strokeWidth={1.5} className="transition-transform duration-200 group-hover:scale-110" />
        <span className={textCounterClass}>{comments_count || 0}</span>
      </button>

      {/* Share / Repost Button */}
      <button
        onClick={() => handle_Like_Reply_Share_Interaction(uuid, "repost")}
        className={`flex items-center gap-2 transition-colors cursor-pointer group ${
          is_reposted ? "text-emerald-400" : `hover:text-white ${defaultActionClass}`
        }`}
      >
        <Share2 
          size={18} 
          strokeWidth={1.5}
          className={`transition-transform duration-200 group-hover:scale-110 ${
            is_reposted ? "text-emerald-400" : ""
          }`} 
        />
        <span className={textCounterClass}>{reposts_count || 0}</span>
      </button>

    </div>
  );
};