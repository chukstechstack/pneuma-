import React from "react";
import { X } from "lucide-react";

interface ImagePreviewCardProps {
  img: File;
  previewUrl?: string | null;
  onRemove?: () => void; // Optional: lets users delete/clear the attached image
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({ 
  img, 
  previewUrl, 
  onRemove 
}) => {
  return (
    // Breaks out edge-to-edge on mobile just like Instagram/X feed tasks with clean sans-serif base
    <div className="relative w-full -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden bg-[#09090b] border-y sm:border border-white/[0.06] shadow-md font-sans">
      
      {/* Subtle filename indicator badge */}
      <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-white/80 font-normal tracking-normal shadow-sm">
        {img.name.length > 24 ? `${img.name.substring(0, 21)}...` : img.name}
      </div>

      {/* Optional Remove / Dismiss Button */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/90 transition-all shadow-sm cursor-pointer"
          aria-label="Remove image"
        >
          <X size={15} />
        </button>
      )}

      {/* Responsive mobile media frame */}
      <div className="relative w-full max-h-[380px] sm:max-h-[450px] bg-black/40 flex items-center justify-center overflow-hidden">
        <img 
          src={previewUrl ?? undefined} 
          alt="Upload preview" 
          className="w-full h-auto max-h-[380px] sm:max-h-[450px] object-cover block transition-all" 
        />
      </div>
    </div>
  );
};