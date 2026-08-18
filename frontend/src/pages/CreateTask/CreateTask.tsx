import React from "react";
import { Link } from "react-router-dom";
import TaskInput from "@components/CreateTask/CreateTask";
import { useCreateTask } from "@pages/CreateTask/useCreateTask";
import { ArrowLeft } from "lucide-react";

const CreateTask = () => {
  const { formData, previewUrl, isPending, handleFormData, submitTask } = useCreateTask();

  return (
    <main className="min-h-screen bg-[#09090b] text-white selection:bg-white/20 selection:text-white pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-[640px] mx-auto">
        
        {/* Minimal Navigation Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            to="/homefeed" 
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </Link>
          <span className="text-xs uppercase tracking-[0.2em] text-white/30 font-medium">
            New Publication
          </span>
        </div>

        {/* Seamless Editor Workspace */}
        <div className="bg-transparent sm:bg-[#121214] sm:border sm:border-white/[0.04] sm:rounded-3xl sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white/95 mb-6 px-1 sm:px-0">
            Document a Testimony
          </h1>

          <TaskInput
            content={formData.content}
            img={formData.img}
            handleFormData={handleFormData}
            submitTask={submitTask}
            isPending={isPending}
            previewUrl={previewUrl}
          />
        </div>

      </div>
    </main>
  );
};

export default CreateTask;