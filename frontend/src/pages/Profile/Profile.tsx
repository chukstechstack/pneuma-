import React, { useState } from "react";
import { MessageInboxDock } from "../MessageInbox/MessageInboxDock";
import ProfileJournal from "@components/Profile/Journal.jsx";
import { AvatarUploadModal } from "../../components/Profile/AvatarUploadModal";
import { useUpdateAvatar } from "@/hooks/useUpdateAvatar";
import { useProfileData } from "@pages/Profile/useProfileData";
import NavBar from "@/pages/NavBar/NavBar";
import { Loader2 } from "lucide-react";
import { ProfileHeader } from "../../components/Profile/ProfileHeader";
import { ConnectionDrawer } from "@/components/Profile/ConnectionDrawer";
import { SettingsDrawer } from "../../components/Profile/SettingsDrawer"; // 🌟 1. Import Settings Drawer

const Profile = () => {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 🌟 2. Add Settings state

  const {
    currentUserUuid,
    isDockOpen,
    setIsDockOpen,
    data,
    isLoading,
    isError,
    navigate,
  } = useProfileData();

  // 📦 Extract profile info, journal tasks, ownership, and the real database connection status
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
      <div className="min-h-screen bg-[#010102] text-white flex flex-col items-center justify-center p-6">
        <Loader2 size={36} className="text-[#d4af37] animate-spin mb-4" />
        <p className="text-gray-400 font-mono tracking-widest text-sm">Reflecting on profile journal...</p>
      </div>
    );
  }

  if (isError || !typedProfile) {
    return (
      <div className="min-h-screen bg-[#010102] text-white flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-400 font-mono tracking-widest text-sm mb-4">Error loading profile data.</p>
        <button
          onClick={() => navigate("/homefeed")}
          className="border border-[#d4af37]/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all rounded-xl cursor-pointer"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010102] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-8">

        {/* 🌟 Centralized Profile Header Component */}
        <ProfileHeader
          typedProfile={typedProfile}
          isOwner={isOwner}
          isConnected={isConnected}
          profileAvatarUrl={profileAvatarUrl}
          setIsAvatarModalOpen={setIsAvatarModalOpen}
          setIsMessageOpen={setIsMessageOpen}
          setIsDockOpen={setIsDockOpen}
          setIsSettingsOpen={setIsSettingsOpen} // 🌟 3. Pass down settings opener
        />

        {/* Profile Journal Scrolls */}
        <ProfileJournal tasks={tasks} />

        {/* Connection Drawer */}
        <ConnectionDrawer
          isOpen={isDockOpen}
          onClose={() => setIsDockOpen(false)}
          targetProfileUuid={typedProfile.uuid}
        />

        {/* Message Inbox Dock / Drawer */}
        <MessageInboxDock
          isOpen={isMessageOpen}
          onClose={() => setIsMessageOpen(false)}
          targetProfileUuid={typedProfile.uuid}
          targetFullName={typedProfile.full_name || "Sanctuary Citizen"}
          targetAvatarUrl={profileAvatarUrl}
        />

        {/* Avatar Preview & Confirmation Modal */}
        <AvatarUploadModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          currentAvatarUrl={profileAvatarUrl}
          onUpload={handleAvatarUpload}
          isPending={isUpdatingAvatar}
        />

        {/* 🌟 4. Render Settings Drawer Modal */}
        <SettingsDrawer
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onProfileUpdated={() => {
            // Optional: triggers any re-fetching if needed when updated
          }}
        />

      </div>
    </div>
  );
};

export default Profile;