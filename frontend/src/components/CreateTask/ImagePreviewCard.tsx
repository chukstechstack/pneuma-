import React from "react";

interface ImagePreviewCardProps {
  img: File;
  previewUrl?: string | null;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({ img, previewUrl }) => {
  const truncatedName = img.name.length > 20 ? `${img.name.substring(0, 20)}...` : img.name;

  return (
    <div className="testimony-preview-image-card">
      <span className="testimony-preview-label-badge">Selected: {truncatedName}</span>
      <div className="testimony-preview-frame">
        <img src={previewUrl ?? undefined} alt="preview" className="testimony-preview-actual-img" />
      </div>
    </div>
  );
};