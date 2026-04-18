import React from "react";
import { Link } from "react-router-dom";
import LikeButton from "../components/LikeButton";

const Task = ({ task, deleteTask, isOwner }) => {
  const { title, content, img, category, tags, uuid } = task;
  return (
    <div>
      <div>
        <div> {title}</div>
        <div> {content}</div>
        <div>
          <img src={img} alt={title} width="200" />
        </div>
        <div>
          <span>{category}</span> <br />
          <span>{tags}</span>
        </div>
        <hr />
        {isOwner && (
          <div>
            <Link to={`/edittask/${uuid}`}> Edit </Link> ||{" "}
            <button onClick={() => deleteTask(uuid)}> Delete </button> <hr />
          </div>
        )}
        <LikeButton task={task} /> <hr />
      </div>
    </div>
  );
};

export default Task;
