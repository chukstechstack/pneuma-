import React from "react";
import { UserPlus, UserCheck, MessageSquare, Users, Loader2 } from "lucide-react";
import { useToggleConnection, useConnections } from "@/hooks/useConnections";

type ProfileEngagementProps = {
  isOwner: boolean;
  isConnected: boolean;
  targetProfileUuid: string; 
  targetFullName: string;  
  targetAvatarUrl: string;  
  onMessageClick: () => void;
  onEditClick?: () => void;
  onOpenInnerCircle: () => void;
  onToggleConnect?: (uuid: string) => void;
};

export const ProfileEngagement = ({
  isOwner,
  isConnected,
  targetProfileUuid,
  onMessageClick,
  onOpenInnerCircle,
  onToggleConnect,
}: ProfileEngagementProps) => {
  
  const { mutate: toggleConnect, isPending } = useToggleConnection(targetProfileUuid);
  
  // 🌟 Fetch connections for the live count badge
  const { data: myConnections = [] } = useConnections(targetProfileUuid);

  const handleConnectClick = () => {
    if (isPending) return;
    
    if (onToggleConnect) {
      onToggleConnect(targetProfileUuid);
    } else {
      toggleConnect();
    }
  };

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      {isOwner ? (
        /* Owner View: Connections */
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <button
            onClick={onOpenInnerCircle}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:border-red-500 text-xs font-mono uppercase tracking-wider text-gray-200 hover:text-red-400 transition-all shadow-md cursor-pointer"
          >
            <Users size={15} />
            <span className="hidden sm:inline">Connections</span>
            {/* Red Live Count Badge */}
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px]">
              {myConnections.length}
            </span>
          </button>
        </div>
      ) : (
        /* Visitor View: Connect, Message, & Connections */
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <button
            disabled={isPending}
            onClick={handleConnectClick}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50 ${
              isConnected
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10" 
                : "border-[#d4af37]/50 text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102]" 
            }`}
          >
            {isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : isConnected ? (
              <>
                <UserCheck size={15} />
                <span className="hidden sm:inline">Connected</span>
              </>
            ) : (
              <>
                <UserPlus size={15} />
                <span className="hidden sm:inline">Connect</span>
              </>
            )}
          </button>
          
          <button 
            onClick={onMessageClick} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-gray-200 hover:border-red-500 hover:text-red-400 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare size={15} />
            <span className="hidden sm:inline">Message</span>
          </button>

          <button
            onClick={onOpenInnerCircle}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:border-red-500 text-xs font-mono uppercase tracking-wider text-gray-200 hover:text-red-400 transition-all shadow-md cursor-pointer"
          >
            <Users size={15} />
            <span className="hidden sm:inline">Connections</span>
            {/* Red Live Count Badge */}
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px]">
              {myConnections.length}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};