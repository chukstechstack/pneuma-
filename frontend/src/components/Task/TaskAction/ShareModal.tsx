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
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content Box */}
      <div className="relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5 text-white">
            <Share2 size={18} className="text-[#d4af37]" />
            <h3 className="font-serif font-bold tracking-wide uppercase text-sm">
              Share Sanctuary Link
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed">
          Copy the link below to share this sanctuary stream with friends or fellow believers.
        </p>

        {/* URL Box & Copy Button Row */}
        <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-xl p-2">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full bg-transparent text-xs text-gray-300 px-3 focus:outline-none font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
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