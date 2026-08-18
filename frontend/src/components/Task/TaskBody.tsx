import React, { useState } from "react";

interface TaskBodyProps {
  content?: string | null;
  img?: string | null;
}

export const TaskBody: React.FC<TaskBodyProps> = ({ content, img }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // Upped the limit slightly to make the text block feel more substantial
  const textLimit = 280; 
  const safeContent = content || "";
  const shouldShowMore = safeContent.length > textLimit;

  return (
    // Removed mt-3, letting the header handle spacing for a tighter grip
    <div className="space-y-4">
      {/* Typography: Slightly larger base size for premium readability, less stark white */}
      <div className="text-white/90 text-[15px] sm:text-[16px] leading-relaxed font-normal tracking-wide whitespace-pre-wrap">
        <span>
          {!isExpanded && shouldShowMore ? `${safeContent.substring(0, textLimit)}...` : safeContent}
        </span>
        {shouldShowMore && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="ml-2 text-sm font-medium text-white/40 hover:text-white transition-colors bg-transparent border-none cursor-pointer inline-flex items-center"
          >
            {isExpanded ? "read less" : "read more"}
          </button>
        )}
      </div>

      {/* Edge-to-Edge Photo: Unsplash style. No radius on mobile, rounded on desktop */}
      {img && (
        // Negative margins pull image outside of the content padding defined in Task.tsx
        <div className="-mx-5 sm:-mx-7 md:rounded-2xl overflow-hidden bg-[#09090b] border-y sm:border border-white/[0.04] my-5">
          <img 
            src={img} 
            alt="media" 
            className="block w-full h-auto max-h-[480px] sm:max-h-[60
            0px] object-cover transition-transform duration-700 ease-out hover:scale-[1.01]" 
          />
        </div>
      )}
    </div>
  );
};