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
    <div className="flex items-center justify-between gap-3 mb-5 relative">
      <div className="flex items-center gap-3">
        <TaskAuthorAvatar
          authorProfileUuid={author_profile_uuid}
          authorAvatarUrl={author_avatar_url}
          fallbackUserAvatar={fallbackUserAvatar}
        />
        
        <TaskAuthorMeta
          authorProfileUuid={author_profile_uuid}
          authorName={author_name}
          currentUserUuid={currentUserUuid}
          isConnected={is_connected}
          createdAt={created_at}
        />
      </div>

      {isOwner && (
        <TaskActionsMenu
          taskUuid={uuid}
          onEdit={onEdit}
          deleteTask={deleteTask}
        />
      )}
    </div>
  );
};