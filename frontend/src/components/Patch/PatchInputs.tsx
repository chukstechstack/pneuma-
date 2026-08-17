import React from "react";
import { ImagePlus, CheckSquare, Loader2 } from "lucide-react";
import { PatchInputProps } from "./PatchInputs.types";
import { TaskImagePreview } from "./TaskImagePreview";


const TaskInput: React.FC<PatchInputProps> = ({
  handleChange,
  content,
  img,
  handleSubmit,
  previewUrl,
  isPending,
}) => {
  return (
    <div className="testimony-form-container">
      <form onSubmit={handleSubmit} className="testimony-form-wrapper">
        {/* ==================== TEXT INPUT SANCTUARY ==================== */}
        <textarea
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="Share your journey with Christ, document a win, or map your insights..."
          rows={6}
          className="testimony-textarea-field"
          required
          disabled={isPending}
        />

        {/* ==================== LIGHTWEIGHT LIVE IMAGE PREVIEW CARD ==================== */}
        <TaskImagePreview img={img} previewUrl={previewUrl} />

        {/* ==================== ACTION HOVER CONTROL ROW ==================== */}
        <div className="testimony-form-actions-row">
          <label className={`testimony-custom-file-upload-btn ${isPending ? "disabled" : ""}`}>
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleChange}
              className="testimony-hidden-file-input"
              disabled={isPending}
            />
            <ImagePlus size={18} strokeWidth={1.5} />
            <span>Image</span>
          </label>

          <button type="submit" className="testimony-submit-action-btn" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <CheckSquare size={16} strokeWidth={2} />
                <span>Publish  </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;