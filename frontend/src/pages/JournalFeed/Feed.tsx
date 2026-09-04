import React, { useState } from "react";
import NavBar from "@/pages/NavBar/NavBar";
import { useJournalData } from "@/pages/JournalFeed/useJournalData";
import { JournalTask } from "@/pages/JournalFeed/Page.types";
import { FullPageLoader } from "@/components/Loaders/FullPageLoader";
import { ChevronLeft } from "lucide-react";

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
    <div className="min-h-screen bg-[#010102] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37] overflow-x-hidden">
      <NavBar />
      
      {/* Mobile-optimized spacing and padding */}
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-20 relative">
        
        {/* 🌟 Top-left Back Button to Home */}
        <button
          onClick={() => navigate("/homefeed")}
          className="absolute top-4 left-3.5 sm:left-6 z-20 w-10 h-10 rounded-full bg-[#121214] border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-md active:scale-95"
          aria-label="Back to Home"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        <main className="w-full flex flex-col gap-6">
          
          {/* 1. Header Banner Section */}
          <JournalHeader isOwner={isOwner} navigate={navigate} />

          {/* 2. Cards Grid Section */}
          <div className="w-full space-y-6">
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