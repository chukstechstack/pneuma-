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
        <div className="text-white font-mono text-xs tracking-[0.25em] text-center font-bold">
          ENTERING PNEUMA...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen sm:min-h-screen text-white font-sans bg-[#070709] overflow-hidden sm:overflow-y-auto">
      <NavBarTyped
        currentUserUuid={userUuid}
        forceHideNavBar={!!activeCommentTaskUuid}
      />

      {/* New Posts Banner */}
      <div className="fixed sm:sticky top-16 sm:top-20 z-40 flex justify-center w-full px-4 pointer-events-none pt-4">
        <div className="pointer-events-auto w-full max-w-lg flex justify-center">
          <NewPostsBanner />
        </div>
      </div>

      {/* Feed Container - TikTok-style snap scroll on mobile, natural document flow on desktop */}
      <main className="h-full sm:h-auto w-full overflow-y-scroll sm:overflow-visible snap-y sm:snap-none snap-mandatory scrollbar-none max-w-lg sm:max-w-xl mx-auto px-0 sm:px-4 pb-32 flex flex-col items-center gap-0 sm:gap-8 pt-16 sm:pt-4">
        {tasks.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center px-4 py-20 snap-center">
            <div className="text-center py-12 px-6 rounded-2xl border border-white/10 bg-[#0f0f12] max-w-md">
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
                className="w-full h-full sm:h-auto snap-start flex items-center justify-center transform-gpu shrink-0"
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
        <div ref={ref} className="h-32 sm:h-20 w-full flex items-center justify-center bg-transparent snap-center shrink-0">
          {isFetchingNextPage && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest">
              Loading dispatches...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeFeed;