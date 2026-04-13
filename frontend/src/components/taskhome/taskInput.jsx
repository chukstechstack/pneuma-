import React from "react";
import { Link } from "react-router-dom";

const Task = ({ title, content, img, category, tags, deleteTask, uuid }) => {
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
        <Link to={`/edittask/${uuid}`}> Edit </Link>
        <button onClick={() => deleteTask(uuid)}> Delete </button>
        <button> likes</button>
      </div>
      <hr />
    </div>
  );
};

export default Task;
