// src/hooks/useSingleTask.ts
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios"; // Adjust path to your axios instance

export interface SingleTask {
  id: number | string;
  uuid: string;
  content: string;
  img_url: string | null;
  created_at: string;
  author_uuid: string;
  author_name: string;
  author_avatar_url: string | null;
}

export const useSingleTask = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await api.get(`/task/${taskId}`);
      return response.data.task as SingleTask;
    },
    enabled: !!taskId, // Only runs if the taskId is present
  });
};