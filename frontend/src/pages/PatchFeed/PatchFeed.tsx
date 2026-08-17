import React from "react";
import TaskInput from "@/components/Patch/PatchInputs";
import { usePatchFeed } from "@pages/PatchFeed/usePatchFeed"


const PatchFeed: React.FC = () => {
  const {
    taskToEdit,
    formData,
    previewUrl,
    isPending,
    handleChange,
    handleSubmit,
    navigate,
  } = usePatchFeed();

  if (!taskToEdit) {
    return (
      <div className="error-container">
        <p>Task not found. Redirecting...</p>
        <button onClick={() => navigate("/homefeed")}>Back to Feed</button>
      </div>
    );
  }

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