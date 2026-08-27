import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "@/api/socketApi"; 
import { TaskItem } from "@shared/types";

export const usePostEditSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleTaskUpdated = (eventData: { taskId: string; updatedTask: Partial<TaskItem> }) => {
      if (!eventData?.taskId || !eventData?.updatedTask) return;

      // 1. Helper function to surgically update paginated task lists
      const updatePaginatedCache = (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            tasks: page.tasks.map((task: TaskItem) => 
              task.uuid === eventData.taskId 
                ? { ...task, ...eventData.updatedTask } 
                : task
            ),
          })),
        };
      };

      // 2. Update Home Feed
      queryClient.setQueryData(["homeFeed"], updatePaginatedCache);

      // 3. Update any active Journal Feeds & Profile Feeds dynamically across the cache
      queryClient.getQueriesData({ queryKey: ["journalFeed"] }).forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, updatePaginatedCache);
      });

      queryClient.getQueriesData({ queryKey: ["profileFeed"] }).forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, updatePaginatedCache);
      });
    };

    socket.on("server:task_updated", handleTaskUpdated);

    return () => {
      socket.off("server:task_updated", handleTaskUpdated);
    };
  }, [queryClient]);
};