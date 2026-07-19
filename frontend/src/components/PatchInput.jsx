import React from "react";
import "../styles/CreateTask.css";
import { ImagePlus, CheckSquare, Loader2 } from "lucide-react";

const TaskInput = ({
  handleChange,
  content,
  img,
  handleSubmit,
  previewUrl,
  isPending,
}) => {
  const imageName = img instanceof File ? img.name : "Current Image Asset";
  const displaySrc = previewUrl || img;

  return (
    <div className="testimony-form-container">
      <form onSubmit={handleSubmit} className="testimony-form-wrapper">
        {/* ==================== TEXT INPUT SANCTUARY ==================== */}
        <textarea
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="Share your journey with Christ, document a win, or map your insights..."
          rows="6"
          className="testimony-textarea-field"
          required
          disabled={isPending} // Prevent edits while saving
        />

        {/* ==================== LIGHTWEIGHT LIVE IMAGE PREVIEW CARD ==================== */}
        {img && (
          <div className="testimony-preview-image-card">
            <span className="testimony-preview-label-badge">
              {imageName.length > 20
                ? `${imageName.slice(0, 17)}...`
                : imageName}
            </span>
            <div className="testimony-preview-frame">
              <img
                src={displaySrc}
                alt="preview"
                className="testimony-preview-actual-img"
              />
            </div>
          </div>
        )}

        {/* ==================== ACTION HOVER CONTROL ROW ==================== */}
        <div className="testimony-form-actions-row">
          <label
            className={`testimony-custom-file-upload-btn ${isPending ? "disabled" : ""}`}
          >
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

          <button
            type="submit"
            className="testimony-submit-action-btn"
            disabled={isPending}
          >
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
