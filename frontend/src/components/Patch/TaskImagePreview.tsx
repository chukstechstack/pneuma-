import React, { useState, useEffect } from "react";

interface TaskImagePreviewProps {
  img: File | string | null;
  previewUrl?: string;
}

export const TaskImagePreview: React.FC<TaskImagePreviewProps> = ({ img, previewUrl }) => {
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (img instanceof File) {
      const url = URL.createObjectURL(img);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setObjectUrl(undefined);
      };
    }
    setObjectUrl(undefined);
  }, [img]);

  if (!img) return null;

  const imageName = img instanceof File ? img.name : "Current Image Asset";
  const displaySrc = previewUrl || (typeof img === "string" ? img : objectUrl);

  return (
    <div className="w-full font-sans my-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl">
      {/* Social Media Style Header Tag */}
      <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-xs text-gray-400">
        <span className="truncate max-w-[220px] sm:max-w-xs font-medium">
          {imageName.length > 25 ? `${imageName.slice(0, 22)}...` : imageName}
        </span>
        <span className="text-[#d4af37] font-semibold tracking-wide uppercase text-[10px]">Preview</span>
      </div>

      {/* Responsive Mobile-Optimized Image Container (Instagram/X style max height and object-cover) */}
      <div className="relative w-full max-h-[350px] sm:max-h-[400px] flex items-center justify-center bg-black/60 overflow-hidden">
        <img 
          src={displaySrc} 
          alt="preview" 
          className="w-full h-auto max-h-[350px] sm:max-h-[400px] object-cover transition-all" 
        />
      </div>
    </div>
  );
};