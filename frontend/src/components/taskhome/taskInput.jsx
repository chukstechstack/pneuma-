import React from "react";

const Task = ({ title, content, img, category, tags, index }) => {
  return (
    <div>
      <div> {index}</div>
      <div> {title}</div>
      <div> {content}</div>
      <div>
        <img src={img} alt={title} width="200" />
      </div>
      <div> {category}</div>
      <div> {tags}</div>
      <button> Edit </button>
      <button> Delete </button>
      <button> likes</button>
    </div>
  );
};

export default Task;
