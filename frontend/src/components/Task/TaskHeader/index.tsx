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
    // Reduced spacing and forced a crisp height to mimic the Instagram post header
    <div className="flex items-center justify-between gap-2 h-14 pb-3 mb-1 border-b border-white/[0.02] relative">
      <div className="flex items-center gap-2.5">
        {/* Instagram style avatar usually has tighter padding/margins */}
        <div className="flex-shrink-0 scale-95 origin-left">
          <TaskAuthorAvatar
            authorProfileUuid={author_profile_uuid}
            authorAvatarUrl={author_avatar_url}
            fallbackUserAvatar={fallbackUserAvatar}
          />
        </div>
        
        {/* Metabar handles the bold username and subtle inline timestamp */}
        <TaskAuthorMeta
          authorProfileUuid={author_profile_uuid}
          authorName={author_name}
          currentUserUuid={currentUserUuid}
          isConnected={is_connected}
          createdAt={created_at}
        />
      </div>

      {isOwner && (
        // Adjusted padding to sit perfectly flush against the right edge of the card container
        <div className="-mr-2 flex items-center justify-center text-white/80 hover:text-white transition-colors">
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
