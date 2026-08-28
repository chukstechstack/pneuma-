import React from "react";
import { UserPlus, UserCheck, MessageSquare, Loader2 } from "lucide-react";
import { useToggleConnection } from "@/hooks/useConnections";

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
  onToggleConnect,
}: ProfileEngagementProps) => {
  
  const { mutate: toggleConnect, isPending } = useToggleConnection(targetProfileUuid);

  const handleConnectClick = () => {
    if (isPending) return;
    
    if (onToggleConnect) {
      onToggleConnect(targetProfileUuid);
    } else {
      toggleConnect();
    }
  };

  // If viewing your own profile, we don't need connect/message buttons in the footer
  if (isOwner) {
    return null; 
  }

  return (
    <div className="flex items-center gap-2.5 w-full">
      {/* Connect Button */}
      <button
        disabled={isPending}
        onClick={handleConnectClick}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50 ${
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
            <span>Connected</span>
          </>
        ) : (
          <>
            <UserPlus size={15} />
            <span>Connect</span>
          </>
        )}
      </button>
      
      {/* Message Button */}
      <button 
        onClick={onMessageClick} 
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-gray-200 hover:border-red-500 hover:text-red-400 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm"
      >
        <MessageSquare size={15} />
        <span>Message</span>
      </button>
    </div>
  );
};