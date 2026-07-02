import React, { useState, useEffect, useContext } from "react";
import TaskInput from "../components/CreateTaskInput";
import { useNavigate, Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import api from "../api/axios.js";
import "../styles/CreateTask.css";

import FullPageLoader from "../components/Loader.jsx";
import "../styles/Loader.css";

const CreateTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    img: null,
    category: "",
    tags: "",
  });

  const { update_Created_Task_In_UseContext_State } = useContext(TaskContext);
  const navigate = useNavigate();

  const { content, img } = formData;

  const handleFormData = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value,
    }));
  };

  const submitTask = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    try {
      setIsLoading(true);
      const res = await api.post("/task", data);

      setFormData({
        title: "",
        content: "",
        img: null,
        category: "",
        tags: "",
        user_id: "",
      });
      update_Created_Task_In_UseContext_State(res.data.newTask);

      navigate("/home");
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (img && typeof img === "object") {
        URL.revokeObjectURL(img);
      }
    };
  }, [img]);

  return (
    <main className="create-task-layout">
      {isLoading && <FullPageLoader />}

      <div className="create-task-ambient-glow"></div>

      <section className="create-task-container">
        <header className="create-task-header">
          <Link to="/home" className="create-task-back-link">
            ← Back to Archive Feed
          </Link>
          <h1 className="create-task-title">Document a Testimony</h1>
          <div className="create-task-divider"></div>
          <p className="create-task-subtitle">
            Write your personal insights, struggles, or record an unshakeable
            milestone of faith.
          </p>
        </header>

        <TaskInput
          content={content}
          img={img}
          handleFormData={handleFormData}
          submitTask={submitTask}
        />
      </section>
    </main>
  );
};

export default CreateTask;
