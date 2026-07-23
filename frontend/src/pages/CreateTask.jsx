import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@api/axios.js";
import TaskInput from "@components/CreateTaskInput.jsx";
import "@styles/CreateTask.css";

const CreateTask = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    content: "",
    img: null,
  });

  const [previewUrl, setPreviewUrl] = useState("");

  const mutation = useMutation({
    mutationFn: (data) => api.post("/task", data),
    onSuccess: () => {
 
      queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
    },
  });

  const handleFormData = (e) => {
    const { name, value, files } = e.target;

    if (name === "img" && files?.length) {
      const file = files[0];
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, img: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const submitTask = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    mutation.mutate(data, {
      onSuccess: () => {
        navigate("/home");
      },
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <main className="create-task-layout">
      <section className="create-task-container">
        <header className="create-task-header">
          <Link to="/home">← Back</Link>
          <h1>Document a Testimony</h1>
        </header>

        <TaskInput
          content={formData.content}
          img={formData.img}
          handleFormData={handleFormData}
          submitTask={submitTask}
          isPending={mutation.isPending}
          previewUrl={previewUrl}
        />
      </section>
    </main>
  );
};

export default CreateTask;
