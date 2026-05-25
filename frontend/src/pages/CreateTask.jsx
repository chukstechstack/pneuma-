import React, { useState, useEffect, useContext } from "react";
import TaskInput from "../components/CreateTaskInput";
import { useNavigate, Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import api from "../api/axios.js";
// Change this line from Register.css to inputs.css
import "../styles/Inputs.css";

import FullPageLoader from "../components/Loader.jsx"; /*  1. ADD LOADER IMPORT */
import "../styles/Loader.css"; /*  2. ADD LOADER STYLES */

const CreateTask = () => {
  const [isLoading, setIsLoading] =
    useState(false); /*  3. ADD INITIAL LOADING STATE */
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    img: null,
    category: "",
    tags: "",
  });

  const { addTaskToState } = useContext(TaskContext);
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
      setIsLoading(true); /*  4. TRIGGER SPINNER ON START */
      const res = await api.post("/task", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({
        title: "",
        content: "",
        img: null,
        category: "",
        tags: "",
        user_id: "",
      });
      addTaskToState(res.data.newTask);
      navigate("/home");
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      console.error(message);
    } finally {
      setIsLoading(false); /*  5. TURN OFF SPINNER WHEN DONE/FAILED */
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
      {/*  6. INJECT SPINNER TARGET IF ACTIVE */}
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
