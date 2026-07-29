import React from "react";
import { TaskProps } from "./Task.types";
import { TaskHeader } from "./TaskHeader";
import { TaskBody } from "./TaskBody";
import { TaskActions } from "./TaskActions";
import "@styles/Profile.css";

const fallbackUserAvatar =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20762%20762%22%20fill%3D%22none%22%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22381%22%20r%3D%22381%22%20fill%3D%22%231e2030%22%2F%3E%3Ccircle%20cx%3D%22381%22%20cy%3D%22300%22%20r%3D%22120%22%20fill%3D%22%238e92a2%22%2F%3E%3Cpath%20d%3D%22M181%20600c0-110%2090-200%20200-200s200%2090%20200%20200%22%20stroke%3D%22%238e92a2%22%20stroke-width%3D%2240%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E";

const Task: React.FC<TaskProps> = ({
  task,
  deleteTask,
  isOwner,
  handle_Like_Reply_Share_Interaction,
  currentUserUuid,
  onEdit,
}) => {
  return (
    <div className="pneuma-post-card-root">
      <TaskHeader
        task={task}
        isOwner={isOwner}
        currentUserUuid={currentUserUuid}
        onEdit={onEdit}
        deleteTask={deleteTask}
        fallbackUserAvatar={fallbackUserAvatar}
      />
      <TaskBody content={task.content} img={task.img} />
      <TaskActions
        uuid={task.uuid}
        is_liked={task.is_liked}
        is_reposted={task.is_reposted}
        likes_count={task.likes_count}
        comments_count={task.comments_count}
        reposts_count={task.reposts_count}
        handle_Like_Reply_Share_Interaction={handle_Like_Reply_Share_Interaction}
      />
    </div>
  );
};

export default Task;