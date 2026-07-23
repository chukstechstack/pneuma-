import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import TaskInput from "@components/PatchInput.jsx";
import { useUpdateTask } from "@hooks/useTaskMutations";
import { useAuthStore } from "@store/useAuthStore.js";
import "@styles/CreateTask.css";

const PatchFeed = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const currentUserUuid = user?.uuid;
  const { uuid } = useParams();
  const queryClient = useQueryClient();

  const findTask = () => {
    const journalData = queryClient.getQueryData(["journal", currentUserUuid]);
    const homeData = queryClient.getQueryData(["homeFeed"]);

    return (
      journalData?.pages.flatMap((p) => p.tasks).find((t) => t.uuid === uuid) ||
      homeData?.pages.flatMap((p) => p.tasks).find((t) => t.uuid === uuid)
    );
  };

  const taskToEdit = findTask();

  const [formData, setFormData] = useState({
    content: taskToEdit?.content || "",
    img: taskToEdit?.img || null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  const { mutate: updateTask, isPending } = useUpdateTask(currentUserUuid);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!taskToEdit) {
    return (
      <div className="error-container">
        <p>Task not found. Redirecting...</p>
        <button onClick={() => navigate("/home")}>Back to Feed</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "img" && files?.length) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, img: file }));

      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.content) data.append("content", formData.content);
    if (formData.img instanceof File) {
      data.append("img", formData.img);
    }

    updateTask(
      { uuid, formData: data, content: formData.content },
      {
        onSuccess: () => {
          navigate("/home");
        },
      },
    );
  };

  return (
    <main className="create-task-layout">
      <div className="create-task-ambient-glow"></div>

      <section className="create-task-container">
        <header className="create-task-header">
          <h1 className="create-task-title">Modify Testimony</h1>
          <div className="create-task-divider"></div>
          <p className="create-task-subtitle">
            Refine your personal insights, adjust details, or keep your record
            of faith current.
          </p>
        </header>

        <TaskInput
          handleChange={handleChange}
          content={formData.content}
          img={formData.img}
          handleSubmit={handleSubmit}
          previewUrl={previewUrl}
          isPending={isPending}
        />
      </section>
    </main>
  );
};

export default PatchFeed;
