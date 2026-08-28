import React from "react";
import { Shield, Camera, Settings } from "lucide-react";
import { ProfileEngagement } from "@/components/Profile/Engagement.js";
import ProfileShareButton from "@/components/Profile/ProfileShareButton";

interface ProfileHeaderProps {
  typedProfile: {
    uuid: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    [key: string]: any;
  };
  isOwner: boolean;
  isConnected: boolean;
  profileAvatarUrl: string;
  setIsAvatarModalOpen: (isOpen: boolean) => void;
  setIsMessageOpen: (isOpen: boolean) => void;
  setIsDockOpen: (isOpen: boolean) => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  typedProfile,
  isOwner,
  isConnected,
  profileAvatarUrl,
  setIsAvatarModalOpen,
  setIsMessageOpen,
  setIsDockOpen,
  setIsSettingsOpen,
}) => {
  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#09090b] via-[#121008] to-[#010102] border border-white/[0.08] relative overflow-hidden shadow-2xl flex flex-col gap-4 w-full box-border">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[40px] pointer-events-none" />

      {/* Top Row: Avatar on left, Action Controls (Share/Settings) on right */}
      <div className="flex items-center justify-between relative z-10 w-full">
        
        {/* Clickable Avatar Container */}
        <div
          className="relative shrink-0 group cursor-pointer"
          onClick={() => isOwner && setIsAvatarModalOpen(true)}
        >
          <img
            src={profileAvatarUrl}
            alt={typedProfile.full_name || "Sanctuary Citizen"}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover object-center border-2 border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-transform group-hover:scale-[1.02]"
          />

          {isOwner && (
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#d4af37]">
              <Camera size={18} />
            </div>
          )}

          <div className="absolute bottom-0 right-0 p-1 bg-[#010102] border border-[#d4af37]/40 rounded-full text-[#d4af37]">
            <Shield size={12} className="sm:w-[14px] sm:h-[14px]" />
          </div>
        </div>

        {/* Action Controls (Settings / Share in top right corner) */}
        <div className="flex items-center gap-2 shrink-0 self-start">
          <ProfileShareButton profileUuid={typedProfile.uuid} />
          
          {isOwner && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#d4af37]/50 text-gray-300 hover:text-[#d4af37] transition-all cursor-pointer shadow-md backdrop-blur-md"
              title="Account Settings"
            >
              <Settings size={16} className="text-[#d4af37]" />
            </button>
          )}
        </div>
      </div>

      {/* Identity & Bio Stacked Below (Instagram / Twitter Style) */}
      <div className="space-y-1.5 relative z-10 w-full text-left">
        <h1 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-white leading-snug break-words">
          {typedProfile.full_name || "Sanctuary Citizen"}
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm font-sans leading-relaxed break-words">
          {typedProfile.bio || "Building a legacy of faith, daily records, and spiritual growth."}
        </p>
      </div>

      {/* Bottom Bar: Engagement Buttons */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between relative z-10 w-full overflow-x-auto">
        <div className="w-full flex items-center justify-between gap-2">
          <ProfileEngagement
            isOwner={isOwner}
            isConnected={isConnected}
            targetProfileUuid={typedProfile.uuid}
            targetFullName={typedProfile.full_name || "Sanctuary Citizen"}
            targetAvatarUrl={profileAvatarUrl}
            onMessageClick={() => setIsMessageOpen(true)}
            onOpenInnerCircle={() => setIsDockOpen(true)}
          />
        </div>
      </div>

    </div>
  );
};