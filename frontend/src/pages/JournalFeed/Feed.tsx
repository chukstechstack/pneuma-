import React, { useState } from "react";
import NavBar from "@/pages/NavBar/NavBar";
import { useJournalData } from "@/pages/JournalFeed/useJournalData";
import { JournalTask } from "@/pages/JournalFeed/Page.types";
import { BookOpen, Loader2, Sparkles, X, Calendar, ArrowUpRight } from "lucide-react";
import { FullPageLoader } from "@/components/Loaders/FullPageLoader"; // 👉 Import extracted loader

const JournalPage = (): React.ReactElement => {
  const {
    journalTasks,
    isOwner,
    isLoading,
    isFetchingNextPage,
    userUuid,
    ref,
    deleteSelectedTask,
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
          
          {/* Header Banner */}
          <div className="mb-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#09090b] via-[#121008] to-[#09090b] border border-white/[0.08] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 mb-4">
                  <Sparkles size={14} className="text-[#d4af37]" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37]">Personal Sanctuary Archive</span>
                </div>
                
                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide uppercase text-white mb-2">
                  Your Journal Feed
                </h1>
                <p className="text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed">
                  Your secure collection of testimonies, prayers, and written milestones. Preserving your life book page by page.
                </p>
              </div>

              {isOwner && (
                <button
                  onClick={() => navigate(`/patchfeed/new`)}
                  className="self-start sm:self-auto border border-[#d4af37]/60 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] rounded-xl flex items-center gap-2"
                >
                  <span>New Testimony</span>
                  <ArrowUpRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div>
            {journalTasks.length === 0 ? (
              <div className="text-center py-20 px-6 rounded-3xl border border-white/[0.06] bg-[#09090b]/40 backdrop-blur-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <BookOpen size={28} />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-1">No Testimonies Saved Yet</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  Start documenting your journey with Christ or record your daily walk to populate your book.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {journalTasks.map((task) => {
                  const { uuid, content, created_at, img } = task;
                  return (
                    <div 
                      key={uuid} 
                      onClick={() => setSelectedTask(task)}
                      className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 bg-[#09090b] cursor-pointer shadow-lg hover:border-[#d4af37] transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt="journal testimony"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#121008] to-[#010102] p-4 flex items-center justify-center text-center">
                          <BookOpen size={24} className="text-[#d4af37]/40" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                      <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                        <div className="flex justify-end">
                          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#d4af37]">
                            {formatDate(created_at)}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-200 line-clamp-4 font-medium group-hover:text-white transition-colors">
                          {content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal */}
            {selectedTask && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-[#09090b] border border-white/[0.12] rounded-3xl p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                    <div className="flex items-center gap-2 text-[#d4af37]">
                      <Calendar size={16} />
                      <span className="text-xs font-mono uppercase tracking-widest">{formatDate(selectedTask.created_at)}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedTask(null)}
                      className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-[#d4af37] transition-all cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {selectedTask.img && (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 max-h-72 bg-black">
                      <img 
                        src={selectedTask.img} 
                        alt="Testimony media" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-gray-100 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal mb-8">
                    {selectedTask.content}
                  </p>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    {isOwner && (
                      <button
                        onClick={() => {
                          const id = selectedTask.uuid;
                          setSelectedTask(null);
                          navigate(`/patchfeed/${id}`);
                        }}
                        className="border border-[#d4af37]/60 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all rounded-xl"
                      >
                        Modify Entry
                      </button>
                    )}
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-auto">Pneuma Sanctuary Scroll</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination Ref */}
            <div ref={ref} className="py-10 flex justify-center items-center">
              {isFetchingNextPage && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#09090b] border border-white/10 text-xs font-mono text-[#d4af37] tracking-widest uppercase shadow-lg">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Loading more scrolls...</span>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default JournalPage;