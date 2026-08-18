import React from "react";
import TaskInput from "@/components/Patch/PatchInputs";
import { usePatchFeed } from "@pages/PatchFeed/usePatchFeed";

const PatchFeed: React.FC = () => {
  const {
    taskToEdit,
    formData,
    previewUrl,
    isPending,
    handleChange,
    handleSubmit,
    navigate,
  } = usePatchFeed();

  if (!taskToEdit) {
    return (
      <div className="min-h-screen bg-[#010102] text-white flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-400 font-mono tracking-widest text-sm mb-4">Record not found. Redirecting...</p>
        <button 
          onClick={() => navigate("/homefeed")}
          className="border border-[#d4af37]/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all rounded-xl"
        >
          Back to Sanctuary Feed
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#010102] text-white py-16 px-6 relative flex flex-col items-center justify-center">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent blur-[100px] pointer-events-none" />

      <section className="w-full max-w-2xl relative z-10 border border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl">
        <header className="mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider uppercase text-white mb-3">
            Modify Testimony
          </h1>
          <div className="h-[2px] w-12 bg-[#d4af37] mb-4" />
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Refine your personal insights, adjust details, or keep your record of faith current.
          </p>
        </header>

        <TaskInput
          handleChange={handleChange}
          content={formData.content}
          img={formData.img}
          handleSubmit={handleSubmit}
          previewUrl={previewUrl}
          isPending={isPending}
        />
      </section>
    </main>
  );
};

export default PatchFeed;