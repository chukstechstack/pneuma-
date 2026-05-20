import React from "react";
// Change this line from Register.css to inputs.css
import "../styles/inputs.css"; 
// Links safely to your master consolidated stylesheet hub
import { ImagePlus, CheckSquare } from 'lucide-react';

const TaskInput = ({ 
  handleChange, 
  content, 
  img, 
  handleSubmit 
}) => {
  // Determine if we need to show a label or filename for the image preview banner
  const hasImage = !!img;
  const isNewFile = img instanceof File;
  const imageName = isNewFile ? img.name : "Current Image Asset";

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
        />

        {/* ==================== LIGHTWEIGHT LIVE IMAGE PREVIEW CARD ==================== */}
        {hasImage && (
          <div className="testimony-preview-image-card">
            <span className="testimony-preview-label-badge">
              {imageName.length > 20 ? `${imageName.substring(0, 20)}...` : imageName}
            </span>
            <div className="testimony-preview-frame">
              <img
                src={isNewFile ? URL.createObjectURL(img) : img}
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
              onChange={handleChange}
              className="testimony-hidden-file-input"
            />
            <ImagePlus size={18} strokeWidth={1.5} />
            <span>Change Image</span>
          </label>

          {/* Primary Form Submission Action Trigger */}
          <button type="submit" className="testimony-submit-action-btn">
            <CheckSquare size={16} strokeWidth={2} />
            <span>Save Updates</span>
          </button>

        </div>

      </form>
    </div>
  );
};

export default TaskInput;
