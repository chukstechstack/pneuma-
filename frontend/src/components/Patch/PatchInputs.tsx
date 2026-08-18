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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ==================== TEXT INPUT SANCTUARY ==================== */}
        <textarea
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="Share your journey with Christ, document a win, or map your insights..."
          rows={6}
          className="w-full p-4 bg-black/60 border border-white/15 rounded-xl text-white placeholder-gray-500 text-sm sm:text-base leading-relaxed focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all resize-none"
          required
          disabled={isPending}
        />

        {/* ==================== LIGHTWEIGHT LIVE IMAGE PREVIEW CARD ==================== */}
        <TaskImagePreview img={img} previewUrl={previewUrl} />

        {/* ==================== ACTION HOVER CONTROL ROW ==================== */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-gray-300 hover:border-[#d4af37] hover:text-[#d4af37] transition-all cursor-pointer ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              disabled={isPending}
            />
            <ImagePlus size={16} strokeWidth={1.5} />
            <span>Image</span>
          </label>

          <button 
            type="submit" 
            className="border border-[#d4af37]/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center gap-2 rounded-xl disabled:opacity-50 disabled:pointer-events-none" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckSquare size={16} strokeWidth={2} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;