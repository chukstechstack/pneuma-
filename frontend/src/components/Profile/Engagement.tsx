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

  if (isOwner) {
    return null; 
  }

  return (
    <div className="flex items-center gap-2.5 w-full pt-3">
      {/* Connect Button */}
      <button
        disabled={isPending}
        onClick={handleConnectClick}
        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer shadow-sm disabled:opacity-50 ${
          isConnected
            ? "border-emerald-500 text-emerald-600 bg-emerald-50 hover:border-[#fe2c55] hover:text-[#fe2c55]" 
            : "border-transparent text-white bg-[#fe2c55] hover:bg-[#e0244b] shadow-md" 
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
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-[#161823] hover:border-[#fe2c55] hover:text-[#fe2c55] text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer shadow-sm"
      >
        <MessageSquare size={15} />
        <span>Message</span>
      </button>
    </div>
  );
};