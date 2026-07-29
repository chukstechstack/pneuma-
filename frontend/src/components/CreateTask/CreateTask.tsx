import React from "react";
import { ImagePlus, CheckSquare } from "lucide-react";
import { TaskInputProps } from "./TaskInput.types";
import { ImagePreviewCard } from "./ImagePreviewCard";
import "@/styles/CreateTask.css";

const TaskInput: React.FC<TaskInputProps> = ({
  img,
  submitTask,
  content,
  handleFormData,
  isPending,
  previewUrl,
}) => {
  return (
    <div className="testimony-form-container">
      <form onSubmit={submitTask} className="testimony-form-wrapper">
        {/* ==================== TEXT INPUT SANCTUARY ==================== */}
        <textarea
          name="content"
          value={content}
          onChange={handleFormData}
          placeholder="Share your journey with Christ, document a win, or map your insights..."
          rows={6}
          className="testimony-textarea-field"
          required
          disabled={isPending}
        />

        {/* ==================== IMAGE PREVIEW CARD ==================== */}
        {img && <ImagePreviewCard img={img} previewUrl={previewUrl} />}

        {/* ==================== ACTION CONTROL ROW ==================== */}
        <div className="testimony-form-actions-row">
          <label className="testimony-custom-file-upload-btn">
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleFormData}
              className="testimony-hidden-file-input"
              disabled={isPending}
            />
            <ImagePlus size={18} strokeWidth={1.5} />
            <span>Image</span>
          </label>

          <button type="submit" className="testimony-submit-action-btn" disabled={isPending}>
            <CheckSquare size={16} strokeWidth={2} />
            <span>{isPending ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;