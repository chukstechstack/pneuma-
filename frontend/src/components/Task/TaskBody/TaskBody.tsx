import React, { useState } from "react";

interface TaskBodyProps {
  content?: string | null;
  img?: string | null;
}

export const TaskBody: React.FC<TaskBodyProps> = ({ content, img }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const textLimit = 120; // Lowered to feel like an Instagram-style truncated caption
  const safeContent = content || "";
  const shouldShowMore = safeContent.length > textLimit;

  return (
    <div className="flex flex-col w-full font-sans">
      {/* 1. Edge-to-Edge Photo (Top like Instagram) */}
      {img && (
        <div className="-mx-5 sm:-mx-7 overflow-hidden bg-black aspect-square sm:aspect-auto max-h-[500px] sm:max-h-[600px] flex items-center justify-center border-b border-white/[0.04]">
          <img 
            src={img} 
            alt="media" 
            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.01]" 
          />
        </div>
      )}

      {/* 2. Caption Text Block (Bottom like Instagram) */}
      {safeContent && (
        <div className="mt-4 px-1 text-white/90 text-[14px] sm:text-[15px] leading-relaxed font-normal tracking-normal whitespace-pre-wrap">
          <span>
            {!isExpanded && shouldShowMore 
              ? `${safeContent.substring(0, textLimit).trim()}...` 
              : safeContent}
          </span>
          {shouldShowMore && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="ml-1 text-xs font-semibold text-white/50 hover:text-white transition-colors bg-transparent border-none cursor-pointer inline"
            >
              {isExpanded ? " less" : " more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};