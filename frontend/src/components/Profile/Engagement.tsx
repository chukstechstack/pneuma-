import React from "react";
import { UserPlus, UserCheck, MessageSquare, PenSquare, Users, Loader2 } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { useToggleConnection } from "@/hooks/useConnections"; // 👈 Import your DB mutation hook

type ProfileEngagementProps = {
  isOwner: boolean;
  isConnected: boolean;
  targetProfileUuid: string; 
  targetFullName: string;  
  targetAvatarUrl: string;  
  onMessageClick: () => void;
  onEditClick?: () => void;
  onOpenInnerCircle: () => void;
  onToggleConnect?: (uuid: string) => void; // Optional custom override handler
};

export const ProfileEngagement = ({
  isOwner,
  isConnected,
  targetProfileUuid,
  onMessageClick,
  onEditClick,
  onOpenInnerCircle,
  onToggleConnect,
}: ProfileEngagementProps) => {
  
  // 🚀 Hook directly into your PostgreSQL mutation hook
  const { mutate: toggleConnect, isPending } = useToggleConnection(targetProfileUuid);

  const handleConnectClick = () => {
    if (isPending) return;
    
    // If a custom parent handler was provided, use it. Otherwise, use the DB hook directly!
    if (onToggleConnect) {
      onToggleConnect(targetProfileUuid);
    } else {
      toggleConnect();
    }
  };

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      {isOwner ? (
        /* Owner View: Edit Journal, Connections, & Logout */
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <button 
            onClick={onEditClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-mono uppercase tracking-wider hover:bg-[#d4af37] hover:text-[#010102] transition-all cursor-pointer shadow-sm"
          >
            <PenSquare size={15} />
            <span>Edit Journal</span>
          </button>

          <button
            onClick={onOpenInnerCircle}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:border-[#d4af37] text-xs font-mono uppercase tracking-wider text-gray-200 hover:text-[#d4af37] transition-all shadow-md cursor-pointer"
          >
            <Users size={15} />
            <span>Connections</span>
          </button>

          <LogoutButton className="flex-1 sm:flex-none" />
        </div>
      ) : (
        /* Visitor View: Connect, Message, & Inner Circle */
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
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-gray-200 hover:border-[#d4af37] hover:text-[#d4af37] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare size={15} />
            <span>Message</span>
          </button>

          <button
            onClick={onOpenInnerCircle}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:border-[#d4af37] text-xs font-mono uppercase tracking-wider text-gray-200 hover:text-[#d4af37] transition-all shadow-md cursor-pointer"
          >
            <Users size={15} />
            <span> Connections </span>
          </button>
        </div>
      )}
    </div>
  );
};