import React, { useState } from "react";
import { Share2 } from "lucide-react";
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
        className={`inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl border transition-all shadow-md cursor-pointer text-xs font-mono uppercase tracking-wider shrink-0 ${
          copied 
            ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" 
            : "border-white/15 bg-white/[0.03] hover:border-[#d4af37] text-gray-200 hover:text-[#d4af37]"
        }`}
        title="Share Profile"
      >
        <Share2 size={14} className="sm:w-[15px] sm:h-[15px]" />
        <span className="text-[10px] sm:text-xs">
          {copied ? "Copied!" : "Share"}
        </span>
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