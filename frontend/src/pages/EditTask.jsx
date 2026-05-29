import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TaskInput from "../components/EditInput.jsx";
import api from "../api/axios.js";
import TaskContext from "../context/TaskContext.jsx";
import FullPageLoader from "../components/Loader.jsx";
// Change this line from Register.css to inputs.css
import "../styles/CreateTask.css";

const EditPost = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { tasks, updateTaskInState, loading } = useContext(TaskContext);
  const taskToEdit = tasks.find((t) => t.uuid === uuid);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    content: taskToEdit?.content || "",
    img: taskToEdit?.img || null,
  });

  //  ADD THIS BLOCK (Only updates state when the actual task switches)
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        content: taskToEdit.content || "",
        img: taskToEdit.img || null,
      });
    }
  }, [uuid, taskToEdit]);

  const { content, img } = formData;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  

    const data = new FormData();
    if (content) data.append("content", content);
    if (img instanceof File) {
      data.append("img", img);
    }
    try {
      setIsUpdating(true);
      const res = await api.patch(`/task/${uuid}`, data);
      setFormData({
        content: "",
        img: null,
      });
      updateTaskInState(res.data.updatedTask);
      navigate("/home");
    } catch (err) {
      const message = err.response?.data?.error || "Update failed";
      console.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Clean up memory leaks from local preview URLs
  useEffect(() => {
    return () => {
      if (img && typeof img === "string") {
        URL.revokeObjectURL(img);
      }
    };
  }, [img]);

  if (loading || isUpdating) {
    return <FullPageLoader />;
  }

  return (
    <main className="create-task-layout">
      <div className="create-task-ambient-glow"></div>

      <section className="create-task-container">
        <header className="create-task-header">
          <Link to="/home" className="create-task-back-link">
            ← Back to Archive Feed
          </Link>
          <h1 className="create-task-title">Modify Testimony</h1>
          <div className="create-task-divider"></div>
          <p className="create-task-subtitle">
            Refine your personal insights, adjust details, or keep your record
            of faith current.
          </p>
        </header>

        <TaskInput
          handleChange={handleChange}
          content={content}
          img={img}
          handleSubmit={handleSubmit}
        />
      </section>
    </main>
  );
};

export default EditPost;
