import React from "react";
import { Sparkles, Shield, Camera } from "lucide-react";
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
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  typedProfile,
  isOwner,
  isConnected,
  profileAvatarUrl,
  setIsAvatarModalOpen,
  setIsMessageOpen,
  setIsDockOpen,
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#09090b] via-[#121008] to-[#010102] border border-white/[0.08] relative overflow-hidden shadow-2xl flex flex-col gap-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[60px] pointer-events-none" />

      {/* User Bio Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">

        {/* Clickable Avatar Container */}
        <div
          className="relative shrink-0 group cursor-pointer"
          onClick={() => isOwner && setIsAvatarModalOpen(true)}
        >
          <img
            src={profileAvatarUrl}
            alt={typedProfile.full_name || "Sanctuary Citizen"}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-transform group-hover:scale-[1.02]"
          />

          {isOwner && (
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#d4af37]">
              <Camera size={24} />
            </div>
          )}

          <div className="absolute bottom-0 right-0 p-1.5 bg-[#010102] border border-[#d4af37]/40 rounded-full text-[#d4af37]">
            <Shield size={14} />
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10">
            <Sparkles size={12} className="text-[#d4af37]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37]">Sanctuary Citizen</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide uppercase text-white">
            {typedProfile.full_name || "Sanctuary Citizen"}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-mono max-w-lg leading-relaxed">
            {typedProfile.bio || "Building a legacy of faith, daily records, and spiritual growth."}
          </p>
        </div>
      </div>

      {/* Embedded Toolbar Inside Profile Border */}
      <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <ProfileEngagement
          isOwner={isOwner}
          isConnected={isConnected}
          targetProfileUuid={typedProfile.uuid}
          targetFullName={typedProfile.full_name || "Sanctuary Citizen"}
          targetAvatarUrl={profileAvatarUrl}
          onMessageClick={() => setIsMessageOpen(true)}
          onOpenInnerCircle={() => setIsDockOpen(true)} // 👈 Cleanly triggers the modal drawer from Profile.tsx
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ProfileShareButton profileUuid={typedProfile.uuid} />
        </div>
      </div>
    </div>
  );
};