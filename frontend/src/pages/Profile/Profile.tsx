import React, { useState } from "react";
import { MessageInboxDock } from "../MessageInbox/MessageInboxDock";
import ProfileJournal from "@components/Profile/Journal.jsx";
import { AvatarUploadModal } from "../../components/Profile/AvatarUploadModal";
import { useUpdateAvatar } from "@/hooks/useUpdateAvatar";
import { useProfileData } from "@pages/Profile/useProfileData";
import NavBar from "@/pages/NavBar/NavBar";
import { Loader2, ChevronLeft } from "lucide-react";
import { ProfileHeader } from "../../components/Profile/ProfileHeader";
import { ConnectionDrawer } from "@/components/Profile/ConnectionDrawer";
import { SettingsDrawer } from "@/components/Profile/SettingsDrawer";

const Profile = () => {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    currentUserUuid,
    isDockOpen,
    setIsDockOpen,
    data,
    isLoading,
    isError,
    navigate,
  } = useProfileData();

  const profile = data?.profile;
  const tasks = data?.tasks || [];
  const isOwner = data?.isOwner ?? false;
  const isConnected = (data as { is_connected?: boolean } | undefined)?.is_connected ?? false;

  const typedProfile = profile as {
    uuid: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    [key: string]: any;
  } | undefined;

  const { mutateAsync: updateAvatar, isPending: isUpdatingAvatar } = useUpdateAvatar(typedProfile?.uuid || "");

  const profileAvatarUrl =
    typedProfile?.avatar_url ||
    "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+24%2C+2026%2C+04_24_39+PM.jpg";

  const handleAvatarUpload = async (file: File) => {
    await updateAvatar(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white sm:bg-[#030305] text-[#161823] sm:text-white flex flex-col items-center justify-center p-6">
        <Loader2 size={32} className="text-[#fe2c55] animate-spin mb-3" />
        <p className="text-gray-500 sm:text-gray-400 font-mono tracking-widest text-[10px] uppercase">Loading Profile...</p>
      </div>
    );
  }

  if (isError || !typedProfile) {
    return (
      <div className="min-h-screen bg-white sm:bg-[#030305] text-[#161823] sm:text-white flex flex-col items-center justify-center p-6 text-center">
        <p className="text-[#fe2c55] font-mono tracking-wider text-xs mb-4">Signal lost. Profile inaccessible.</p>
        <button
          onClick={() => navigate("/homefeed")}
          className="border border-gray-200 sm:border-white/10 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#161823] sm:text-white bg-gray-100 sm:bg-white/10 hover:bg-[#fe2c55] hover:text-white transition-all rounded-full cursor-pointer shadow-sm"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white sm:bg-[#030305] text-[#161823] sm:text-white font-sans selection:bg-[#fe2c55]/20 selection:text-[#fe2c55] overflow-x-hidden w-full max-w-[100vw]">
      <NavBar />

      {/* Responsive Container: slimmed spacing for mobile */}
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-6 pt-4 sm:pt-28 pb-20 box-border relative">

        {/* Top-left Back Button */}
        <button
          onClick={() => navigate("/homefeed")}
          className="absolute top-2 left-2 sm:top-24 sm:left-6 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 sm:bg-[#121214] border border-gray-200 sm:border-white/10 flex items-center justify-center text-[#161823] sm:text-white/80 hover:bg-[#fe2c55] hover:text-white hover:border-transparent transition-all cursor-pointer shadow-sm active:scale-95"
          aria-label="Back to Home"
        >
          <ChevronLeft size={21} strokeWidth={2.5} />
        </button>

        {/* Profile Header */}
        <ProfileHeader
          typedProfile={typedProfile}
          isOwner={isOwner}
          isConnected={isConnected}
          profileAvatarUrl={profileAvatarUrl}
          setIsAvatarModalOpen={setIsAvatarModalOpen}
          setIsMessageOpen={setIsMessageOpen}
          setIsDockOpen={setIsDockOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />

        {/* Content Grid */}
        <div className="w-full pt-2">
          <ProfileJournal tasks={tasks} />
        </div>

        {/* Drawers & Modals */}
        <ConnectionDrawer
          isOpen={isDockOpen}
          onClose={() => setIsDockOpen(false)}
          targetProfileUuid={typedProfile.uuid}
        />

        <MessageInboxDock
          isOpen={isMessageOpen}
          onClose={() => setIsMessageOpen(false)}
          targetProfileUuid={typedProfile.uuid}
          targetFullName={typedProfile.full_name || "Sanctuary Citizen"}
          targetAvatarUrl={profileAvatarUrl}
        />

        <AvatarUploadModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          currentAvatarUrl={profileAvatarUrl}
          onUpload={handleAvatarUpload}
          isPending={isUpdatingAvatar}
        />

        <SettingsDrawer
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onProfileUpdated={() => {}}
        />

      </div>
    </div>
  );
};

export default Profile;