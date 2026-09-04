import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { ShareModal } from "@/components/Task/TaskAction/ShareModal";

interface ProfileShareButtonProps {
  profileUuid: string;
}

export const ProfileShareButton: React.FC<ProfileShareButtonProps> = ({ profileUuid }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generates the correct profile route link
  const profileShareUrl = `${window.location.origin}/profile/${profileUuid}`;

  const handleSuccessfulShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
          copied ? "text-emerald-500" : "text-[#161823] hover:text-[#fe2c55]"
        }`}
        title="Share Profile"
      >
        {copied ? (
          <Check size={26} strokeWidth={2.5} />
        ) : (
          <Share2 size={26} strokeWidth={2} />
        )}
      </button>

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={profileShareUrl}
        onSuccessfulShare={handleSuccessfulShare}
      />
    </>
  );
};

export default ProfileShareButton;