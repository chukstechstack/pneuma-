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
    setPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleConfirm = async () => {
    if (!selectedFile || !imageRef.current) return;
    const canvas = document.createElement("canvas");
    const canvasSize = 400;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();

    const previewContainer = imageRef.current.parentElement;
    const containerSize = previewContainer ? previewContainer.clientWidth : 180;
    const renderScale = canvasSize / containerSize;

    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(scale, scale);
    ctx.translate(position.x * renderScale, position.y * renderScale);

    const naturalAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = canvasSize;
    let drawHeight = canvasSize;

    if (naturalAspect > 1) {
      drawWidth = canvasSize * naturalAspect;
    } else {
      drawHeight = canvasSize / naturalAspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#ffffff] rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">

        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#161823] hover:text-[#fe2c55] transition-colors cursor-pointer"
        >
          <X size={26} strokeWidth={2.5} />
        </button>

        <h3 className="font-black text-2xl sm:text-3xl text-[#161823] tracking-tight mb-2 mt-2">
          {selectedFile ? "Position Avatar" : "Update Photo"}
        </h3>
        <p className="text-gray-500 text-sm mb-7 max-w-[260px] leading-relaxed">
          {selectedFile ? "Drag to reposition, pinch or slide to zoom." : "Choose a striking photo for your profile."}
        </p>

        {/* Cropper Viewport — no border, just shadow */}
        <div 
          className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-lg mb-6 bg-gray-100 cursor-grab active:cursor-grabbing select-none touch-none group mx-auto flex items-center justify-center"
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
            alt="Preview"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
            className="w-full h-full object-cover pointer-events-none absolute inset-0 m-auto"
          />

          {!selectedFile && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-sm font-bold gap-2 z-10"
            >
              <Upload size={28} className="text-white" />
              <span>Upload Image</span>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="w-full flex items-center justify-between px-1 mb-7 gap-4">
            <div className="flex items-center gap-3 flex-1">
              <ZoomIn size={20} className="text-[#161823] shrink-0" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-[#fe2c55] cursor-pointer h-2 bg-gray-200 rounded-lg"
              />
            </div>
            <button
              onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
              className="text-[#161823] hover:text-[#fe2c55] transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-black uppercase tracking-wide text-[#161823] transition-all cursor-pointer"
          >
            {selectedFile ? "Change" : "Browse"}
          </button>

          {selectedFile && (
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#fe2c55] text-white font-black text-sm uppercase tracking-wide shadow-md hover:bg-[#e0244b] transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
              <span>{isPending ? "Saving..." : "Apply"}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AvatarUploadModal;