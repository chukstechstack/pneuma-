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

        </div>

        {tasks.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-gray-500 text-xs sm:text-sm font-mono tracking-wider">
              No record
            </p>
          </div>
        ) : (
          // 🌟 TikTok-style 3-column grid, tight gap, taller aspect cards
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
            {tasks.map((task) => {
              const { uuid, content, created_at, img } = task;
              return (
                <div
                  key={uuid}
                  onClick={() => setSelectedTask(task)}
                  className="group relative aspect-[9/16] overflow-hidden bg-[#09090b] cursor-pointer transition-all duration-300"
                >
                  {img ? (
                    <img
                      src={img}
                      alt="journal"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#121008] to-[#010102] p-2 flex items-center justify-center text-center">
                      <BookOpen size={20} className="text-[#d4af37]/40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute inset-0 p-2 flex flex-col justify-between z-10">
                    <div className="flex justify-end">
                      <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-[#d4af37]">
                        {formatDate(created_at)}
                      </span>
                    </div>

                    <p className="text-[11px] sm:text-xs text-gray-200 line-clamp-2 font-medium group-hover:text-white transition-colors">
                      {content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <ProfileJournalModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      </div>
    </div>
  );
};

export default ProfileJournal;