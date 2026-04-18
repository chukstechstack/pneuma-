const TaskInput = ({
  img,
  submitTask,
  title,
  content,
  category,
  tags,
  handleFormData,
}) => {
  return (
    <div>
      <form onSubmit={submitTask}>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleFormData}
          placeholder="Title"
        />
        <hr />

        <textarea
          name="content"
          value={content}
          onChange={handleFormData}
          placeholder="share your jouney with Christ"
          rows="6"
        />
        <hr />

        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleFormData}
        />
        <hr />

        <label htmlFor="category-select"> Choose a category: </label>
        <select name="category" value={category} onChange={handleFormData}>
          <option value="" disabled>
            -- Please Choose an Option --
          </option>
          <option value="testimony"> Testimony</option>
          <option value="prayer"> Prayer Request </option>
          <option value="encouragement"> Encouragement </option>
        </select>

        <hr />

        <input
          type="text"
          name="tags"
          value={tags}
          onChange={handleFormData}
          placeholder="Tags"
        />
        <hr />

        <button type="submit"> Submit</button>
      </form>

      {img && (
        <div>
          <p> Selected image: {img.name}</p>
          <img
            src={URL.createObjectURL(img)}
            alt="preview"
            width={200}
            style={{ marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default TaskInput;
