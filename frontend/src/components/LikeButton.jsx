import React, { useContext } from "react";
import TaskContext from "../context/TaskContext";
import api from "../api/axios";
import { toast } from "react-toastify";

const LikeButton = ({ task }) => {
  const { toggleLikeInState } = useContext(TaskContext);
  const handleLike = async () => {
    try {
      const res = await api.post(`/task/${task.uuid}/likes`);
      toggleLikeInState(task.uuid, res.data.liked);
    } catch (err) {
      toast.error("could not process like", err.message);
    }
  };

  return (
    <div onClick={handleLike}>
      <span style={{ fontSize: "15px",  cursor: "pointer" }}>{task.is_liked ? "❤️" : "🤍"}</span>

      <span style={{ fontWeight: "bold", fontSize: "16px", color: "#444" }}>
        {task.like_count || 0}
      </span>
    </div>
  );
};

export default LikeButton;
