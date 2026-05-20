import React from "react";
import "../styles/Home.css"; // Links safely to your master consolidated stylesheet hub
import { ImagePlus, CheckSquare } from 'lucide-react';
// Change this line from Register.css to inputs.css
import "../styles/inputs.css"; 

const TaskInput = ({
  img,
  submitTask,
  content,
  handleFormData,
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
          rows="6"
          className="testimony-textarea-field"
          required
        />

        {/* ==================== LIGHTWEIGHT LIVE IMAGE PREVIEW CARD ==================== */}
        {img && (
          <div className="testimony-preview-image-card">
            <span className="testimony-preview-label-badge">
              Selected: {img.name.length > 20 ? `${img.name.substring(0, 20)}...` : img.name}
            </span>
            <div className="testimony-preview-frame">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="testimony-preview-actual-img"
              />
            </div>
          </div>
        )}

        {/* ==================== ACTION HOVER CONTROL ROW ==================== */}
        <div className="testimony-form-actions-row">
          
          {/* Custom Styled File Upload Button */}
          <label className="testimony-custom-file-upload-btn">
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleFormData}
              className="testimony-hidden-file-input"
            />
            <ImagePlus size={18} strokeWidth={1.5} />
            <span>Add Image</span>
          </label>

          {/* Primary Form Submission Action Trigger */}
          <button type="submit" className="testimony-submit-action-btn">
            <CheckSquare size={16} strokeWidth={2} />
            <span>Publish</span>
          </button>

        </div>

      </form>
    </div>
  );
};

export default TaskInput;
