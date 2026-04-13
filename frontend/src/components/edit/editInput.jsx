import React from "react";

const TaskInput = ({
  title,
  handleChange,
  content,
  category,
  tags,
  img,
  handleSubmit,
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="title"
          type="text"
        />
        <hr />
        <textarea
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="content"
          type="text"
          rows="6"
        />
        <hr />
        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleChange}
        />
        <hr />
        <label htmlFor="category-select"> Choose a category: </label>
        <select name="category" value={category} onChange={handleChange}>
          <option value="" disabled>
            -- Please Choose an Option --
          </option>
          <option value="testimony"> Testimony</option>
          <option value="prayer"> Prayer Request </option>
          <option value="encouragement"> Encouragement </option>
        </select>
        <hr />
        <input
          name="tags"
          value={tags}
          onChange={handleChange}
          placeholder="tags"
          type="text"
        />
        <hr />
        {img && (
          <img
            src={img instanceof File ? URL.createObjectURL(img) : img}
            alt="Post Preview"
            width={200}
            style={{ marginTop: "10px" }}
          />
        )}
        <hr />
        <button type="submit"> Submit </button> <hr />
      </form>
    </div>
  );
};
export default TaskInput;
