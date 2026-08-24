import React, { useState, useRef } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string;
  onUpload: (file: File) => Promise<void>; // Your mutation trigger
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121008] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <h3 className="font-serif text-xl font-bold text-white mb-2">Update Sanctuary Avatar</h3>
        <p className="text-gray-400 text-xs mb-6 max-w-xs">
          Choose a new visual representation for your profile and stream entries.
        </p>

        {/* Image Preview Box */}
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-[#d4af37]/50 shadow-[0_0_25px_rgba(212,175,55,0.25)] mb-6 group">
          <img
            src={previewUrl || currentAvatarUrl}
            alt="Avatar Preview"
            className="w-full h-full object-cover"
          />
          {/* Overlay click to trigger gallery */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-xs font-medium gap-1"
          >
            <Upload size={20} className="text-[#d4af37]" />
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
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono uppercase tracking-wider text-white transition-all cursor-pointer"
          >
            {selectedFile ? "Change Image" : "Browse Gallery"}
          </button>

          {selectedFile && (
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] text-black font-semibold text-xs tracking-wider shadow-lg hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Confirm</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};