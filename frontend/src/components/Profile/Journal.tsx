import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { ProfileJournalModal } from "./ProfileJournalModal";

type ProfileJournalProps = {
  tasks: Array<{
    uuid: string;
    content: string;
    created_at: string;
    img?: string;
  }>;
};

const ProfileJournal: React.FC<ProfileJournalProps> = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="w-full">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {tasks.slice(0, 5).map((task) => {
              const { uuid, content, created_at, img } = task;
              return (
                <div 
                  key={uuid} 
                  onClick={() => setSelectedTask(task)}
                  className="group relative h-60 sm:h-72 rounded-2xl overflow-hidden border border-white/10 bg-[#09090b] cursor-pointer shadow-lg hover:border-[#d4af37] transition-all duration-300 transform hover:-translate-y-1"
                >
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

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

        {/* Clean Extracted Full Screen Modal Component */}
        <ProfileJournalModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      </div>
    </div>
  );
};

export default ProfileJournal;