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
      <div className="min-h-screen bg-[#030305] flex items-center justify-center px-4">
        <div className="text-[#d4af37] animate-pulse font-mono text-xs tracking-[0.25em] text-center">
          ENTERING SANCTUARY...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37] relative overflow-x-hidden w-full max-w-[100vw]">
      
      {/* Background Cinematic Lighting Glow (Shrunk for mobile to prevent overflow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[300px] sm:h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.07)_0%,_transparent_70%)] blur-[100px] sm:blur-[130px] pointer-events-none" />

      {/* Navigation */}
      <NavBarTyped currentUserUuid={userUuid} />

      {/* 🌟 Self-Contained Real-Time Refresh Banner Container */}
      <div className="sticky top-16 sm:top-20 z-40 flex justify-center px-3 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[720px] flex justify-center">
          <NewPostsBanner />
        </div>
      </div>

      {/* Main Feed Stream */}
      <div className="w-full max-w-[720px] mx-auto px-3 sm:px-6 pt-10 sm:pt-16 pb-28 sm:pb-36 relative z-10 box-border">
        <main className="flex flex-col gap-4 sm:gap-6 w-full">
          
          {tasks.length === 0 ? (
            <div className="text-center py-12 sm:py-20 px-4 sm:px-6 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-[#030305]/40 backdrop-blur-sm mx-auto w-full max-w-md">
          
          
              <p className="text-gray-400 text-xs sm:text-sm max-w-xs mx-auto">
                Your feed is currently quiet. Follow others or share your walk to populate your sanctuary feed.
              </p>
            </div>
          ) : (
            tasks.map((task: TaskItem) => (
              <div key={task.uuid || task.id} className="w-full overflow-hidden">
                <Task
                  task={task}
                  currentUserUuid={userUuid}
                  isOwner={isOwner(task)}
                  onDelete={() => deleteSelectedTask(task.uuid)}
                  onEdit={(uuid) => navigate(`/patchfeed/${uuid}`)}
                />
              </div>
            ))
          )}

          {/* Infinite Scroll Trigger & Loader */}
          <div ref={ref} className="h-14 flex items-center justify-center mt-2">
            {isFetchingNextPage && (
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[#d4af37] text-[10px] sm:text-xs uppercase tracking-[0.2em] animate-pulse shadow-xl">
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