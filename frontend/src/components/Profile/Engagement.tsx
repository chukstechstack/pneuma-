import React from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { RootState } from "@/store/ReduxStore"; 
import { toggleFollowStatus } from "@/hooks/followsSlice"; 
import { UserPlus, UserCheck, MessageSquare, PenSquare } from "lucide-react";

type ProfileEngagementProps = {
  isOwner: boolean;
  targetProfileUuid: string; 
  targetFullName: string;  
  targetAvatarUrl: string;  
  onMessageClick: () => void;
};

const ProfileEngagement = ({
  isOwner,
  targetProfileUuid,
  targetFullName,
  targetAvatarUrl,
  onMessageClick,
}: ProfileEngagementProps) => {
  const dispatch = useDispatch(); 
  
  const isFollowing = useSelector(
    (state: RootState) => !!state.follows.followingStatus[targetProfileUuid]
  );

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      {/* ============================ */}
      {isOwner ? (
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-mono uppercase tracking-wider hover:bg-[#d4af37] hover:text-[#010102] transition-all cursor-pointer shadow-sm">
          <PenSquare size={15} />
          <span>Edit Journal</span>
        </button>
        // ================================
      ) : (
        <>
          <button
            onClick={() => 
              dispatch(
                toggleFollowStatus({
                  uuid: targetProfileUuid,
                  full_name: targetFullName,
                  avatar_url: targetAvatarUrl,
                })
              )
            }
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
              isFollowing
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10" 
                : "border-[#d4af37]/50 text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102]" 
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck size={15} />
                <span>Connected</span>
              </>
            ) : (
              <>
                <UserPlus size={15} />
                <span>Connect</span>
              </>
            )}
          </button>
          
          <button 
            onClick={onMessageClick} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-gray-200 hover:border-[#d4af37] hover:text-[#d4af37] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare size={15} />
            <span>Message</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileEngagement;