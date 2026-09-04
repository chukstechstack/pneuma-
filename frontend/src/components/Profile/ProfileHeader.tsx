import React from "react";
import { Shield, Camera, Settings, Users } from "lucide-react";
import { ProfileEngagement } from "@/components/Profile/Engagement.js";
import ProfileShareButton from "@/components/Profile/ProfileShareButton";
import { useConnections } from "@/hooks/useConnections";

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
  const { data: myConnections = [] } = useConnections(typedProfile.uuid);

  return (
    <div className="relative w-full flex flex-col items-center text-center gap-2.5 sm:gap-4 py-2 font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">

      {/* Top-right floating controls */}
      <div className="absolute top-0 right-0 flex items-center gap-2.5 z-10">
        <ProfileShareButton profileUuid={typedProfile.uuid} />
        {isOwner && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-[#121212] sm:text-white/80 hover:text-[#fe2c55] sm:hover:text-white transition-colors cursor-pointer"
            title="Account Settings"
          >
            <Settings size={22} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Avatar — downsized on mobile (w-24 h-24 -> sm:w-36 sm:h-36) */}
      <div
        className="relative group cursor-pointer mt-1"
        onClick={() => isOwner && setIsAvatarModalOpen(true)}
      >
        <img
          src={profileAvatarUrl}
          alt={typedProfile.full_name || "Sanctuary Citizen"}
          className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover object-center shadow-md transition-transform group-hover:scale-[1.02]"
        />

        {isOwner && (
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <Camera size={20} className="text-white" />
          </div>
        )}

        <div className="absolute bottom-0.5 right-0.5 p-1 bg-white rounded-full text-[#fe2c55] shadow-sm">
          <Shield size={12} />
        </div>
      </div>

      {/* Name — downsized for mobile (text-xl sm:text-5xl) */}
      <h1 className="text-xl sm:text-5xl font-black tracking-tight text-[#121212] sm:text-white leading-[1.1] break-words px-4">
        {typedProfile.full_name || "Sanctuary Citizen"}
      </h1>

      {/* Stats row */}
      <button
        onClick={() => setIsDockOpen(true)}
        className="flex items-center gap-6 cursor-pointer"
        title="View Connections"
      >
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-4xl font-black text-[#121212] sm:text-white leading-none tracking-tight">
            {myConnections.length}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 sm:text-gray-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
            <Users size={11} /> Connections
          </span>
        </div>
      </button>

      {/* Bio — sleek compact sizing on mobile */}
      <p className="text-gray-600 sm:text-gray-300 text-xs sm:text-lg leading-relaxed break-words max-w-sm px-4 font-normal">
        {typedProfile.bio || "Building a legacy of faith, daily records, and spiritual growth."}
      </p>

      {/* Action buttons */}
      <div className="w-full max-w-xs pt-1">
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
  );
};