import React from "react";
import { X } from "lucide-react";

interface ImagePreviewCardProps {
  img: File;
  previewUrl?: string | null;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({ img, previewUrl }) => {
  return (
    // Breaks out edge-to-edge on mobile just like the feed tasks
    <div className="-mx-5 sm:mx-0 sm:rounded-2xl overflow-hidden bg-[#09090b] border-y sm:border border-white/[0.04] relative group">
      
      {/* Subtle filename indicator overlay */}
      <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-white/70 font-medium">
        {img.name.length > 24 ? `${img.name.substring(0, 24)}...` : img.name}
      </div>

      <img 
        src={previewUrl ?? undefined} 
        alt="preview" 
        className="w-full h-auto max-h-[500px] object-cover block" 
      />
    </div>
  );
};