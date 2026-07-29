import React from "react";
import { Link } from "react-router-dom";
import TaskInput from "@components/CreateTask/CreateTask";
import { useCreateTask } from "@pages/CreateTask/useCreateTask";
import "@styles/CreateTask.css";

const CreateTask = () => {
  const { formData, previewUrl, isPending, handleFormData, submitTask } = useCreateTask();

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
          isPending={isPending}
          previewUrl={previewUrl}
        />
      </section>
    </main>
  );
};

export default CreateTask;