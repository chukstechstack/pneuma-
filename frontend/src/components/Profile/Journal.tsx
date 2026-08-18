import React, { useState } from "react";
import { Lock, BookOpen, ArrowRight, MessageSquare, Heart, X, Calendar } from "lucide-react";

type ProfileJournalProps = {
  isOwner: boolean;
  active_Relationtionship_Request_Status: string;
  tasks: Array<{
    uuid: string;
    content: string;
    created_at: string;
    img?: string;
  }>;
  navigate: (path: string) => void;
  currentUserUuid: string;
};

const ProfileJournal: React.FC<ProfileJournalProps> = ({
  isOwner,
  active_Relationtionship_Request_Status,
  tasks,
  navigate,
  currentUserUuid,
}) => {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const isAuthorized =
    isOwner || active_Relationtionship_Request_Status === "active";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="w-full">
      {!isAuthorized ? (
        <div className="text-center py-20 px-6 rounded-3xl border border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <Lock size={26} />
          </div>
          <h3 className="font-serif text-xl font-bold text-white mb-2 uppercase tracking-wide">Scrolls Locked by Author</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Connect with this author to request access to their 5 newest reflections and journal entries.
          </p>
        </div>
      ) : ( 
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <BookOpen size={20} className="text-[#d4af37]" />
              <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-white">
                Rolling Journal Scrolls (5 Newest)
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Sanctuary Archive</span>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl border border-white/[0.06] bg-[#09090b]/40">
              <p className="text-gray-400 text-sm font-mono tracking-wider">
                This author hasn't recorded any public scrolls yet.
              </p>
            </div>
          ) : (
            /* TikTok-Style Mini Card Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {tasks.slice(0, 5).map((task) => {
                const { uuid, content, created_at, img } = task;
                return (
                  <div 
                    key={uuid} 
                    onClick={() => setSelectedTask(task)}
                    className="group relative h-60 sm:h-72 rounded-2xl overflow-hidden border border-white/10 bg-[#09090b] cursor-pointer shadow-lg hover:border-[#d4af37] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Background Image or Fallback Gradient */}
                    {img ? (
                      <img
                        src={img}
                        alt="journal"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#121008] to-[#010102] p-4 flex items-center justify-center text-center">
                        <BookOpen size={24} className="text-[#d4af37]/40" />
                      </div>
                    )}

                    {/* Dark Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Card Content Snippet */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                      <div className="flex justify-end">
                        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#d4af37]">
                          {formatDate(created_at)}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-200 line-clamp-3 font-medium group-hover:text-white transition-colors">
                        {content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Entry Modal Popup */}
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
                    className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-[#d4af37] transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {selectedTask.img && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 max-h-72">
                    <img 
                      src={selectedTask.img} 
                      alt="Modal preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="text-gray-100 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal">
                  {selectedTask.content}
                </p>

                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-gray-500 uppercase tracking-widest">
                  <span>Pneuma Sanctuary Scroll</span>
                  <span className="text-[#d4af37]">Verified</span>
                </div>
              </div>
            </div>
          )}

          {isOwner && (
            <div className="pt-6 flex justify-center">
              <button
                onClick={() => navigate(`/journalfeed/${currentUserUuid}`)}
                className="border border-[#d4af37]/60 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.15)] rounded-xl flex items-center gap-3 group"
              >
                <span>Enter My Full Private Sanctuary Journal</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileJournal;