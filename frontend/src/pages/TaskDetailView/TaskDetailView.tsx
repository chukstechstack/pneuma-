// src/pages/TaskDetailView.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSingleTask } from "../../hooks/useSingleTask"; // Your hook
import { ArrowLeft } from "lucide-react";

export const TaskDetailView: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading, error } = useSingleTask(taskId);
  const navigate = useNavigate();

  if (isLoading) return <div className="p-8 text-center text-white/50">Loading reflection...</div>;
  if (error || !task) return <div className="p-8 text-center text-red-400">Post not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs text-white/60 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-[#121214] border border-white/10 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={task.author_avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
            alt={task.author_name} 
            className="w-10 h-10 rounded-full object-cover border border-white/10"
          />
          <div>
            <h4 className="font-semibold text-sm text-white">{task.author_name}</h4>
            <span className="text-[10px] font-mono text-white/40">
              {new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <p className="text-gray-200 text-sm leading-relaxed mb-4">{task.content}</p>

        {task.img_url && (
          <img src={task.img_url} alt="Post attachment" className="rounded-2xl w-full object-cover max-h-96 border border-white/10" />
        )}
      </div>
    </div>
  );
};