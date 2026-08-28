import React, { useState } from "react";
import { X, Copy, Check, Share2 } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  onSuccessfulShare: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  url,
  onSuccessfulShare,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onSuccessfulShare(); // Turns the share button green & fires backend tracking

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    // Responsive: Bottom sheet on mobile, centered modal on desktop
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in p-0 sm:p-4 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content Box */}
      <div className="relative w-full sm:max-w-md bg-[#09090b] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 flex flex-col gap-5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5 text-white">
            <Share2 size={18} className="text-[#d4af37]" />
            <h3 className="font-sans font-bold tracking-tight text-sm sm:text-base text-white">
              Share Link
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
          Copy the link below to share this post with friends or followers.
        </p>

        {/* URL Box & Copy Button Row */}
        <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-xl p-2">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full bg-transparent text-xs sm:text-sm text-gray-300 px-3 focus:outline-none font-sans truncate"
          />
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-sans font-semibold tracking-wide transition-all cursor-pointer shrink-0 ${
              copied
                ? "bg-emerald-500 text-black"
                : "bg-white/10 text-white hover:bg-white hover:text-black border border-white/20"
            }`}
          >
            {copied ? (
              <>
                <Check size={14} strokeWidth={2.5} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};