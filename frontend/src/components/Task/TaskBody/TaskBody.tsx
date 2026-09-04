import React, { useState } from "react";

interface TaskBodyProps {
  content?: string | null;
  img?: string | null;
}

export const TaskBody: React.FC<TaskBodyProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const textLimit = 90; 
  const safeContent = content || "";
  const shouldShowMore = safeContent.length > textLimit || safeContent.includes("\n");

  if (!safeContent) return null;

  return (
    <div className="flex flex-col w-full font-sans bg-transparent transform-gpu">
      <div className="text-white/95 text-base sm:text-lg font-normal leading-snug tracking-normal">
        <p className={`m-0 ${!isExpanded ? "line-clamp-2" : ""}`}>
          {safeContent}
        </p>

        {shouldShowMore && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }} 
            className="mt-1 font-semibold text-white/80 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-sm tracking-wide"
          >
            {isExpanded ? "less" : "...more"}
          </button>
        )}
      </div>
    </div>
  );
};