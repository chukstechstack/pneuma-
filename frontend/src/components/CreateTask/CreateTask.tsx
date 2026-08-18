import React from "react";
import { ImagePlus, Check } from "lucide-react";
import { TaskInputProps } from "./TaskInput.types";
import { ImagePreviewCard } from "./ImagePreviewCard";

const TaskInput: React.FC<TaskInputProps> = ({
  img,
  submitTask,
  content,
  handleFormData,
  isPending,
  previewUrl,
}) => {
  return (
    <div className="w-full">
      <form onSubmit={submitTask} className="space-y-6">
        
        {/* Borderless Textarea matching the feed's typography */}
        <div className="relative px-1 sm:px-0">
          <textarea
            name="content"
            value={content}
            onChange={handleFormData}
            placeholder="Share your journey with Christ, document a win, or map your insights..."
            rows={7}
            className="w-full bg-transparent border-none text-white/90 placeholder-white/25 focus:outline-none resize-none text-base sm:text-lg leading-relaxed font-normal tracking-wide"
            required
            disabled={isPending}
          />
        </div>

        {/* Edge-to-Edge Image Preview Container */}
        {img && <ImagePreviewCard img={img} previewUrl={previewUrl} />}

        {/* Clean Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] px-1 sm:px-0">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors cursor-pointer group">
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleFormData}
              className="hidden"
              disabled={isPending}
            />
            <ImagePlus size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            <span>Add image</span>
          </label>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 transition-all disabled:opacity-40 cursor-pointer shadow-lg"
            disabled={isPending}
          >
            <Check size={14} strokeWidth={2.5} />
            <span>{isPending ? "Publishing..." : "Publish"}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default TaskInput;