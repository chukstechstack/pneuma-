// src/components/CommentDrawer/useComments.ts
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios.js";

export const useComments = (contentUuid: string) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", contentUuid],
    queryFn: async () => {
      const res = await api.get(`/task/${contentUuid}/fetchComments`);
      return res.data.comments || [];
    },
  });

  const mutation = useMutation({
    mutationFn: (newComment: string) =>
      api.post(`/task/${contentUuid}/comments`, { comment_text: newComment }),

    onMutate: async (newCommentText: string) => {
      await queryClient.cancelQueries({ queryKey: ["comments", contentUuid] });

      const previousComments = queryClient.getQueryData<any[]>(["comments", contentUuid]) || [];

      queryClient.setQueryData(["comments", contentUuid], (old: any[] = []) => [
        ...old,
        {
          uuid: "temp-" + Date.now(),
          comment_text: newCommentText,
          author_name: "You (Posting...)",
        },
      ]);

      setCommentText("");
      return { previousComments };
    },

    onError: (err, newComment, context: any) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", contentUuid], context.previousComments);
      }
      setCommentText(newComment);
      alert("Could not post comment.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", contentUuid] });
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    mutation.mutate(commentText);
  };

  return {
    comments,
    isLoading,
    commentText,
    setCommentText,
    handleSend,
    isPending: mutation.isPending,
  };
};