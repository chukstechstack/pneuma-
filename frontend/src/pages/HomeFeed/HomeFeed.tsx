import React from "react";
import Task from "@components/Task/Task";
import NavBar from "@/pages/NavBar/NavBar";
import { TaskItem } from "@shared/types";
import { useHomeFeed } from "./useHomeFeed/useHomeFeed";
import { NewPostsBanner } from "@/components/New Post Banner/NewPostsBanner";
import { BookOpen } from "lucide-react";

type NavBarProps = { currentUserUuid: string | null };
const NavBarTyped = NavBar as React.ComponentType<NavBarProps>;

const HomeFeed: React.FC = () => {
  const {
    tasks,
    userUuid,
    isLoading,
    isFetchingNextPage,
    ref,
    isOwner,
    deleteSelectedTask,
    navigate,
  } = useHomeFeed();

  // 🌀 Initial Loading State
  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center">
        <div className="text-[#d4af37] animate-pulse font-mono text-xs tracking-[0.25em]">
          ENTERING SANCTUARY...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37] relative overflow-x-hidden">
      
      {/* Background Cinematic Lighting Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.07)_0%,_transparent_70%)] blur-[130px] pointer-events-none" />

      {/* Navigation */}
      <NavBarTyped currentUserUuid={userUuid} />

      {/* 🌟 Self-Contained Real-Time Refresh Banner Container */}
      <div className="sticky top-20 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <NewPostsBanner />
        </div>
      </div>

      {/* Main Feed Stream */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-16 pb-36 relative z-10">
        <main className="flex flex-col gap-6">
          
          {tasks.length === 0 ? (
            <div className="text-center py-20 px-6 rounded-3xl border border-white/[0.06] bg-[#030305]/40 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                <BookOpen size={28} />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-1">
                No Testimonies in Stream
              </h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                Your feed is currently quiet. Follow others or share your walk to populate your sanctuary feed.
              </p>
            </div>
          ) : (
            tasks.map((task: TaskItem) => (
              <Task
                key={task.uuid || task.id}
                task={task}
                currentUserUuid={userUuid}
                isOwner={isOwner(task)}
                onDelete={() => deleteSelectedTask(task.uuid)}
                onEdit={(uuid) => navigate(`/patchfeed/${uuid}`)}
              />
            ))
          )}

          {/* Infinite Scroll Trigger & Loader */}
          <div ref={ref} className="h-14 flex items-center justify-center mt-2">
            {isFetchingNextPage && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[#d4af37] text-xs uppercase tracking-[0.2em] animate-pulse shadow-xl">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping"></span>
                Reflecting further...
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default HomeFeed;