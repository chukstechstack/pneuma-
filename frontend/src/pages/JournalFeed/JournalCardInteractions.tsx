import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageSquare } from "lucide-react";
import { fetchTaskInteractionsApi } from "../../../src/services/InteractionServices/interactionsService";

interface JournalCardInteractionsProps {
  taskUuid: string;
}

export const JournalCardInteractions: React.FC<JournalCardInteractionsProps> = ({ taskUuid }) => {
  // Fetch interactions using your new service with React Query caching
  const { data: interactions } = useQuery({
    queryKey: ["taskInteractions", taskUuid],
    queryFn: () => fetchTaskInteractionsApi(taskUuid),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const likesCount = interactions?.likes_count ?? 0;
  const commentsCount = interactions?.comments?.length ?? 0;

  return (
    <div className="flex items-center gap-3 pt-2 mt-2 border-t border-white/10 text-xs text-gray-300">
      <div className="flex items-center gap-1">
        <Heart size={13} className="text-[#d4af37]" />
        <span className="font-mono text-[11px]">{likesCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageSquare size={13} className="text-gray-400" />
        <span className="font-mono text-[11px]">{commentsCount}</span>
      </div>
    </div>
  );
};