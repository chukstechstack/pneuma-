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
        <br />

        <textarea
          name="content"
          value={content}
          onChange={handleFormData}
          placeholder="Content"
        />
        <br />

        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleFormData}
      
        />
        <br />

        <input
          type="text"
          name="category"
          value={category}
          onChange={handleFormData}
          placeholder="Category"
        />
        <br />

        <input
          type="text"
          name="tags"
          value={tags}
          onChange={handleFormData}
          placeholder="Tags"
        />
        <br />

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
