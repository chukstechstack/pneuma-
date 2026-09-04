import React from "react";
import { TaskHeader } from "./TaskHeader";
import { TaskBody } from "./TaskBody/TaskBody";
import { ActionContainer } from "./TaskAction/ActionContainer";
import { TaskCommentsDrawer } from "./TaskCommentsDrawer";
import { TaskItem } from "@shared/types";

interface TaskProps {
  task: TaskItem;
  currentUserUuid: string | null;
  isOwner: boolean;
  onDelete: () => void;
  onEdit: (uuid: string) => void;
  isCommentsOpen: boolean;
  onToggleComments: (isOpen: boolean) => void;
}

const fallbackAvatar =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20762%20762%22%20fill%3D%22none%22%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22381%22%20r%3D%22381%22%20fill%3D%22%23161618%22%2F%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22300%22%20r%3D%22120%22%20fill%3D%22%238e92a2%22%20%2F%3E%3Cpath%20d%3D%22M181%20600c0-110%2090-200%20200-200s200%2090%20200%20200%22%20stroke%3D%22%238e92a2%22%20stroke-width%3D%2240%22%20stroke-linecap%3D%22round%22%20%2F%3E%3C%2Fsvg%3E";

const Task: React.FC<TaskProps> = ({
  task,
  currentUserUuid,
  isOwner,
  onDelete,
  onEdit,
  isCommentsOpen,
  onToggleComments,
}) => {
  const {
    uuid,
    author_name,
    author_profile_uuid,
    is_connected,
    created_at,
    content,
    img,
    author_avatar_url
  } = task;

  const taskHeaderInfo = {
    uuid,
    author_name,
    author_profile_uuid,
    is_connected: typeof is_connected === 'boolean' ? is_connected : undefined,
    author_avatar_url: typeof author_avatar_url === 'string' ? author_avatar_url : null,
    created_at:
      created_at instanceof Date
        ? created_at.toISOString()
        : created_at ?? undefined,
  };

  return (
    <>
      <article className="w-full flex items-center justify-center bg-transparent relative overflow-visible">

        {/* Card Container with hardware-acceleration hint */}
        <div className="relative w-full sm:max-w-lg lg:max-w-xl h-[78vh] sm:h-[82vh] lg:h-[85vh] overflow-visible rounded-none sm:rounded-2xl shadow-2xl bg-[#070709] flex flex-col justify-end border border-transparent sm:border-white/[0.08] transform-gpu">
          
          {/* Background Media Image wrapper */}
          <div className="absolute inset-0 overflow-hidden rounded-none sm:rounded-2xl z-0 pointer-events-none">
            {img ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#070709]">
                <img
                  src={img}
                  alt="Dispatch media"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain pointer-events-auto"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs italic bg-[#0e0e12]">
                [Text Dispatch Card]
              </div>
            )}
            
            {/* Smooth Bottom Gradient Fade */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#070709] via-[#070709]/95 to-transparent pointer-events-none" />
          </div>

          {/* Action Buttons: Shifted flush to the right edge (right-2 sm:right-4) and moved down (bottom-6 sm:bottom-8) */}
          <div className="absolute right-2 sm:right-4 bottom-16 sm:bottom-20 z-30 pointer-events-auto">
            <ActionContainer
              uuid={uuid}
              onOpenComments={() => onToggleComments(true)}
            />
          </div>

          {/* Profile Header & Caption Content */}
          <div className="relative z-20 px-4 pt-6 pb-4 sm:px-6 sm:pb-6 flex flex-col gap-2 pointer-events-auto mt-auto pr-16 sm:pr-20">
            <TaskHeader
              task={taskHeaderInfo}
              isOwner={isOwner}
              currentUserUuid={currentUserUuid || ""}
              onEdit={onEdit}
              deleteTask={onDelete}
              fallbackUserAvatar={fallbackAvatar}
            />

            {content && (
              <div className="pr-2">
                <TaskBody content={content} img={null} />
              </div>
            )}
          </div>

        </div>
      </article>

      <TaskCommentsDrawer
        uuid={uuid}
        isOpen={isCommentsOpen}
        onClose={() => onToggleComments(false)}
      />
    </>
  );
};

export default Task;