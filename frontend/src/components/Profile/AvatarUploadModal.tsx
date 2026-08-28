import React, { useState, useRef } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string;
  onUpload: (file: File) => Promise<void>;
  isPending: boolean;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onUpload,
  isPending,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md font-sans animate-in fade-in duration-200">
      
      {/* Modal Container: Bottom sheet on mobile, centered card on desktop */}
      <div className="relative w-full sm:max-w-sm bg-[#121008] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center animate-in slide-in-from-bottom duration-300">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header Typography - Social Media Style */}
        <h3 className="font-sans text-base sm:text-lg font-semibold text-white tracking-normal mb-1">
          Update Profile Photo
        </h3>
        <p className="text-gray-400 text-xs font-normal mb-5 max-w-[260px] leading-relaxed">
          Choose a new visual representation for your profile and stream entries.
        </p>

        {/* Compact Mobile-Friendly Image Preview Box */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] mb-5 group bg-black/40">
          <img
            src={previewUrl || currentAvatarUrl}
            alt="Avatar Preview"
            className="w-full h-full object-cover"
          />
          {/* Overlay click to trigger gallery */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-xs font-medium gap-1"
          >
            <Upload size={18} className="text-[#d4af37]" />
            <span>Select Image</span>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-medium text-white transition-all cursor-pointer"
          >
            {selectedFile ? "Change Photo" : "Browse Gallery"}
          </button>

          {selectedFile && (
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] text-black font-semibold text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={15} strokeWidth={2.5} />
                  <span>Save</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};