import React from "react";
import Task from "@components/Task/Task";
import NavBar from "@/pages/NavBar/NavBar";
import { TaskItem } from "@shared/types";
import { useHomeFeed } from "@pages/HomeFeed/useHomeFeed";
import { Sparkles } from "lucide-react";

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
    handle_Like_Reply_Share_Interaction,
    navigate,
  } = useHomeFeed();


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

      <NavBarTyped currentUserUuid={userUuid} />

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-28 pb-36 relative z-10">
        

        {/* Central Feed Stream */}
        <main className="flex flex-col gap-6">
          {tasks.map((task: TaskItem) => (
            <Task
              key={task.uuid || task.id}
              task={task}
              currentUserUuid={userUuid}
              isOwner={isOwner(task)}
              onDelete={() => deleteSelectedTask(task.uuid)}
              onEdit={(uuid) => navigate(`/patchfeed/${uuid}`)}
              onInteraction={handle_Like_Reply_Share_Interaction}
            />
          ))}

          {/* Infinite Scroll Trigger */}
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