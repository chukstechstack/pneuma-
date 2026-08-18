import React from "react";
import { TaskHeader } from "./TaskHeader";
import { TaskBody } from "./TaskBody";
import { TaskActions } from "./TaskActions";
import { TaskItem } from "@shared/types";

interface TaskProps {
  task: TaskItem;
  currentUserUuid: string | null;
  isOwner: boolean;
  onDelete: () => void;
  onEdit: (uuid: string) => void;
  onInteraction: (uuid: string, action: string) => void;
}

const fallbackAvatar =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20762%20762%22%20fill%3D%22none%22%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22381%22%20r%3D%22381%22%20fill%3D%22%23161618%22%2F%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22300%22%20r%3D%22120%22%20fill%3D%22%238e92a2%22%20%2F%3E%3Cpath%20d%3D%22M181%20600c0-110%2090-200%20200-200s200%2090%20200%20200%22%20stroke%3D%22%238e92a2%22%20stroke-width%3D%2240%22%20stroke-linecap%3D%22round%22%20%2F%3E%3C%2Fsvg%3E";

const Task: React.FC<TaskProps> = ({
  task,
  currentUserUuid,
  isOwner,
  onDelete,
  onEdit,
  onInteraction,
}) => {
  const {
    uuid,
    author_name,
    author_profile_uuid,
    relation_status,
    created_at,
    content,
    img,
    is_liked,
    is_reposted,
    likes_count,
    comments_count,
    reposts_count,
  } = task;

  const taskHeaderInfo = {
    uuid,
    author_name,
    author_profile_uuid,
    relation_status,
    created_at:
      created_at instanceof Date
        ? created_at.toISOString()
        : created_at ?? undefined,
  };

  return (
    // PREMIUM 2026 MODE:
    // 1. sm:bg-[#0e0e10]: Softens the heavy deep black to a rich carbon.
    // 2. sm:border sm:border-white/[0.04]: Keeps card structure on desktop.
    // 3. sm:rounded-3xl sm:p-7: Desktop retains card look.
    // 4. Mobile: ZERO background, ZERO border, ZERO padding. Fluid screen.
    <article className="bg-transparent sm:bg-[#0e0e10] sm:border sm:border-white/[0.04] transition-all duration-300 sm:rounded-3xl p-0 sm:p-7 mb-10 sm:shadow-xl overflow-hidden">
      
      {/* Added px-5 to mobile so text doesn't touch absolute edges, but images do. */}
      <div className="px-5 sm:px-0">
        <TaskHeader
          task={taskHeaderInfo}
          isOwner={isOwner}
          currentUserUuid={currentUserUuid || ""}
          onEdit={onEdit}
          deleteTask={onDelete}
          fallbackUserAvatar={fallbackAvatar}
        />

        <TaskBody content={content} img={img} />

        <TaskActions
          uuid={uuid}
          is_liked={is_liked}
          is_reposted={is_reposted}
          likes_count={likes_count}
          comments_count={comments_count}
          reposts_count={reposts_count}
          handle_Like_Reply_Share_Interaction={onInteraction}
        />
      </div>
      
      {/* Optional: subtle separator line only visible on desktop between posts, like Unsplash 
      <div className="hidden sm:block h-px bg-white/5 mt-7" />
      */}
    </article>
  );
};

export default Task;