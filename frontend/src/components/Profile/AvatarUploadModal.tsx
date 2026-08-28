import React, { useState, useRef } from "react";
import { Upload, X, Check, Loader2, RotateCcw, ZoomIn } from "lucide-react";

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
  
  // Cropping / Positioning states
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Dragging handlers for repositioning the photo
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Generate cropped image file using an off-screen Canvas
  const handleConfirm = async () => {
    if (!selectedFile || !imageRef.current) return;

    const canvas = document.createElement("canvas");
    const canvasSize = 400; // Output resolution
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = imageRef.current;
    
    // Clear & draw transformed image onto circular/square crop bounds
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();
    
    // Translate and scale to match user's custom drag/zoom settings
    ctx.translate(canvasSize / 2 + position.x, canvasSize / 2 + position.y);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], selectedFile.name || "avatar.webp", {
          type: "image/webp",
          lastModified: Date.now(),
        });
        await onUpload(croppedFile);
        handleClose();
      },
      "image/webp",
      0.9
    );
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans animate-in fade-in duration-200">
      
      {/* Centered Modal Container for both mobile and desktop */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-[#121008] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <h3 className="font-sans text-base sm:text-lg font-semibold text-white tracking-normal mb-1">
          {selectedFile ? "Adjust Profile Photo" : "Update Profile Photo"}
        </h3>
        <p className="text-gray-400 text-xs font-normal mb-5 max-w-[260px] leading-relaxed">
          {selectedFile ? "Drag to reposition and use slider to zoom." : "Choose a new visual representation for your profile."}
        </p>

        {/* Prominently Centered Cropper Circle Preview Box */}
        <div 
          className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-5 bg-black/60 cursor-grab active:cursor-grabbing select-none touch-none group mx-auto flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={previewUrl || currentAvatarUrl}
            alt="Avatar Preview Cropper"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
            className="w-full h-full object-contain pointer-events-none absolute inset-0 m-auto"
          />

          {/* Helper Grid overlay when dragging */}
          <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"></div>

          {!selectedFile && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-xs font-medium gap-1 z-10"
            >
              <Upload size={18} className="text-[#d4af37]" />
              <span>Select Image</span>
            </div>
          )}
        </div>

        {/* Zoom & Reset Controls (Visible only when file is selected) */}
        {selectedFile && (
          <div className="w-full flex items-center justify-between px-2 mb-5 gap-3">
            <div className="flex items-center gap-2 flex-1">
              <ZoomIn size={14} className="text-white/40 shrink-0" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer h-1 bg-white/20 rounded-lg"
              />
            </div>
            <button
              onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Reset position"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        )}

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
            {selectedFile ? "Choose Another" : "Browse Gallery"}
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
                  <span>Crop & Save</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};