import React, { useState } from "react";
import NavBar from "@/pages/NavBar/NavBar";
import { useJournalData } from "@/pages/JournalFeed/useJournalData";
import { JournalTask } from "@/pages/JournalFeed/Page.types";
import { FullPageLoader } from "@/components/Loaders/FullPageLoader";

// Import Modular Sections
import { JournalHeader } from "./Feed/FeedHeader";
import { JournalGrid } from "./Feed/FeedGrid";
import { JournalModal } from "./Feed/FeedModal";
import { JournalPagination } from "./Feed/FeedPagination";

const JournalPage = (): React.ReactElement => {
  const {
    journalTasks,
    isOwner,
    isLoading,
    isFetchingNextPage,
    ref,
    navigate,
  } = useJournalData();

  const [selectedTask, setSelectedTask] = useState<JournalTask | null>(null);

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="min-h-screen bg-[#010102] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      <NavBar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <main className="w-full">
          
          {/* 1. Header Banner Section */}
          <JournalHeader isOwner={isOwner} navigate={navigate} />

          {/* 2. Cards Grid Section */}
          <div>
            <JournalGrid 
              tasks={journalTasks} 
              onSelectTask={(task) => setSelectedTask(task)} 
              formatDate={formatDate} 
            />

            {/* 3. Modal Overlay Section */}
            <JournalModal 
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
              isOwner={isOwner}
              navigate={navigate}
              formatDate={formatDate}
            />

            {/* 4. Infinite Scroll Pagination Section */}
            <JournalPagination 
              isFetchingNextPage={isFetchingNextPage} 
              loadMoreRef={ref} 
            />
          </div>

        </main>
      </div>
    </div>
  );
};

export default JournalPage;