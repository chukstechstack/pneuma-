import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TaskInput from "../components/PatchInput.jsx";
import api from "../api/axios.js";
import TaskContext from "../context/TaskContext.jsx";
import FullPageLoader from "../components/Loader.jsx";
import "../styles/CreateTask.css";

const PatchFeed = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { tasks, update_Patched_Task_In_UseContext_State, loading } =
    useContext(TaskContext);
  
  const taskToEdit = tasks.find((t) => t.uuid === uuid);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    content: taskToEdit?.content || "",
    img: taskToEdit?.img || null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        content: taskToEdit?.content || "",
        img: taskToEdit?.img || null,
      });
    }
  }, [uuid, taskToEdit]);

  const { content, img } = formData;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img" && files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, img: file }));

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    } else if (name !== "img") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

      // 🎯 FIXED 1: Wiping formData state was completely removed to block pre-navigate layout shifts!

      // 🎯 FIXED 2: Target index [0] to peel back the database query array wrapper safely!
      if (res.data.updatedTask && Array.isArray(res.data.updatedTask)) {
        update_Patched_Task_In_UseContext_State(res.data.updatedTask[0]);
      } else {
        update_Patched_Task_In_UseContext_State(res.data.updatedTask);
      }
      
      navigate("/home");
    } catch (err) {
      const message = err.response?.data?.error || "Update failed";
      console.error("Full Error Object:", err);
      console.error("Backend Error Message:", message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isUpdating || (loading && !taskToEdit)) {
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
          previewUrl={previewUrl}
        />
      </section>
    </main>
  );
};

export default PatchFeed;

