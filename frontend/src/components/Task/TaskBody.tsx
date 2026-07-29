import React, { useState } from "react";

interface TaskBodyProps {
  content?: string | null;
  img?: string | null;
}

export const TaskBody: React.FC<TaskBodyProps> = ({ content, img }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const textLimit = 123;
  const safeContent = content || "";
  const shouldShowMore = safeContent.length > textLimit;

  return (
    <>
      <div className="pneuma-post-body-text">
        <div>
          {!isExpanded && shouldShowMore ? `${safeContent.substring(0, textLimit)}...` : safeContent}
          {shouldShowMore && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="showMoreText">
              {isExpanded ? "Show Less" : "expand"}
            </button>
          )}
        </div>
      </div>

      {img && (
        <div className="taskImageWrapper">
          <img src={img} alt="media" className="taskContentImageCard" />
        </div>
      )}
    </>
  );
};