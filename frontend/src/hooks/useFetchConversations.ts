import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios"; // Matches your existing axios path

interface ConversationItem {
  id: string | number;
  content: string;
  createdAt: string;
  partnerUuid: string;
  partnerName: string;
  partnerAvatarUrl: string | null;
}

export const useFetchConversations = (isOpen: boolean) => {
  return useQuery({
    queryKey: ["conversations-inbox-list"],
    queryFn: async () => {
      const { data } = await axios.get<{ conversations: ConversationItem[] }>("/task/fetchConversationsList");
      return data.conversations;
    },
    // ⚡ Magic part: Only fetches when the user clicks to open the pop-up!
    enabled: isOpen,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  });
};