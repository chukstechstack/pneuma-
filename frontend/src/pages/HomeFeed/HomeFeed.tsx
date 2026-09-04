import React, { useState } from "react";
import Task from "@components/Task/Task";
import NavBar from "@/pages/NavBar/NavBar";
import { TaskItem } from "@shared/types";
import { useHomeFeed } from "./useHomeFeed/useHomeFeed";
import { NewPostsBanner } from "@/components/New Post Banner/NewPostsBanner";

type NavBarProps = {
  currentUserUuid: string | null;
  forceHideNavBar?: boolean;
};
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

  const [activeCommentTaskUuid, setActiveCommentTaskUuid] = useState<string | null>(null);

  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center px-4">
        <div className="text-white animate-pulse font-mono text-xs tracking-[0.25em] text-center font-bold">
          ENTERING PNEUMA...
        </div>
      </div>
    );
  }

  return (
    // 🌟 Removed strict viewport trapping classes so the browser can scroll naturally
    <div className="w-full min-h-screen text-white font-sans selection:bg-white/25 relative bg-[#070709]">
      
      {/* Subtle background glow for desktop */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[rgba(120,119,198,0.08)] blur-[120px] rounded-full" />
      </div>

      <NavBarTyped
        currentUserUuid={userUuid}
        forceHideNavBar={!!activeCommentTaskUuid}
      />

      {/* New Posts Banner */}
      <div className="sticky top-16 sm:top-20 z-40 flex justify-center px-4 pointer-events-none mb-6 pt-4">
        <div className="pointer-events-auto w-full max-w-lg flex justify-center">
          <NewPostsBanner />
        </div>
      </div>

      {/* Feed Container - Natural document flow layout */}
      <main className="relative z-10 max-w-lg sm:max-w-xl mx-auto px-0 sm:px-4 pb-32 flex flex-col items-center gap-8">
        {tasks.length === 0 ? (
          <div className="w-full flex items-center justify-center px-4 py-20">
            <div className="text-center py-12 px-6 rounded-2xl border border-white/[0.08] bg-[#0f0f12]/85 backdrop-blur-xl max-w-md shadow-2xl">
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Your feed is currently quiet. Follow global dispatches or share what's happening around you.
              </p>
            </div>
          </div>
        ) : (
          tasks.map((task: TaskItem) => {
            const taskUuid = task.uuid || task.id;
            return (
              <div
                key={taskUuid}
                className="w-full flex flex-col items-center"
              >
                <Task
                  task={task}
                  currentUserUuid={userUuid}
                  isOwner={isOwner(task)}
                  onDelete={() => deleteSelectedTask(task.uuid)}
                  onEdit={(uuid) => navigate(`/patchfeed/${uuid}`)}
                  isCommentsOpen={activeCommentTaskUuid === taskUuid}
                  onToggleComments={(isOpen) =>
                    setActiveCommentTaskUuid(isOpen && taskUuid != null ? String(taskUuid) : null)
                  }
                />
              </div>
            );
          })
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={ref} className="h-20 w-full flex items-center justify-center bg-transparent">
          {isFetchingNextPage && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white text-xs font-bold tracking-widest animate-pulse shadow-2xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              Loading dispatches...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeFeed;