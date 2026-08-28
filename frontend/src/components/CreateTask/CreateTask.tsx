import React from "react";
import { ImagePlus, Check, Loader2 } from "lucide-react";
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
    <div className="w-full font-sans">
      <form onSubmit={submitTask} className="space-y-4 sm:space-y-6">
        
        {/* Borderless Textarea with Clean Mobile Typography */}
        <div className="relative px-1 sm:px-0">
          <textarea
            name="content"
            value={content}
            onChange={handleFormData}
            placeholder="Share your journey with Christ, document a win, or map your insights..."
            rows={5}
            className="w-full bg-transparent border-none text-white/95 placeholder-white/30 focus:outline-none resize-none text-sm sm:text-base leading-relaxed font-normal tracking-normal"
            required
            disabled={isPending}
          />
        </div>

        {/* Responsive Edge-to-Edge Mobile Image Preview Container */}
        {img && (
          <div className="w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 my-3">
            <ImagePreviewCard img={img} previewUrl={previewUrl} />
          </div>
        )}

        {/* Clean Social Media Style Action Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] px-1 sm:px-0">
          <label className={`inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors cursor-pointer group ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleFormData}
              className="hidden"
              disabled={isPending}
            />
            <ImagePlus size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            <span>Photo</span>
          </label>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all disabled:opacity-40 cursor-pointer shadow-md"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Check size={14} strokeWidth={2.5} />
                <span>Publish</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default TaskInput;