import React from "react";
import { TaskAuthorAvatar } from "./TaskAuthorAvatar";
import { TaskAuthorMeta } from "./TaskAuthorMeta";
import { TaskActionsMenu } from "./TaskActionsMenu";

interface TaskHeaderProps {
  task: {
    uuid: string;
    author_name?: string | null;
    author_profile_uuid: string;
    is_connected?: boolean;
    created_at?: string | null;
    author_avatar_url?: string | null;
  };
  isOwner: boolean;
  currentUserUuid: string;
  onEdit: (uuid: string) => void;
  deleteTask: (uuid: string) => void;
  fallbackUserAvatar: string;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  isOwner,
  currentUserUuid,
  onEdit,
  deleteTask,
  fallbackUserAvatar,
}) => {
  const { uuid, author_name, author_profile_uuid, is_connected = false, created_at, author_avatar_url } = task;

  return (
    <div className="flex items-center justify-between gap-3 pt-1 pb-0.5 w-full relative">
      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-8">
        
        {/* Creator Avatar directly rendered so it respects its true large size */}
        <div className="flex-shrink-0 flex items-center">
          <TaskAuthorAvatar
            authorProfileUuid={author_profile_uuid}
            authorAvatarUrl={author_avatar_url}
            fallbackUserAvatar={fallbackUserAvatar}
          />
        </div>
        
        {/* Author Metadata (Username, Timestamp) */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <TaskAuthorMeta
            authorProfileUuid={author_profile_uuid}
            authorName={author_name}
            createdAt={created_at}
          />
        </div>
      </div>

      {/* Owner Actions Menu (Edit / Delete) - Positioned safely on the right */}
      {isOwner && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/60 hover:text-white transition-all p-1.5 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/10">
          <TaskActionsMenu
            taskUuid={uuid}
            onEdit={onEdit}
            deleteTask={deleteTask}
          />
        </div>
      )}
    </div>
  );
};