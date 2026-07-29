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
    <div className="testimony-preview-image-card">
      <span className="testimony-preview-label-badge">
        {imageName.length > 20 ? `${imageName.slice(0, 17)}...` : imageName}
      </span>
      <div className="testimony-preview-frame">
        <img src={displaySrc} alt="preview" className="testimony-preview-actual-img" />
      </div>
    </div>
  );
};