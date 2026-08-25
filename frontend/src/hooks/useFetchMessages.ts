import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios"; // Or your standard axios/fetch instance

interface FetchMessagesResponse {
  messages: Array<{
    id: string | number;
    senderUuid: string;
    content: string;
    createdAt: string;
  }>;
}

export const useFetchMessages = (targetProfileUuid: string, isOpen: boolean) => {
  return useQuery({
    queryKey: ["messages", targetProfileUuid],
    queryFn: async () => {
      const { data } = await axios.get<FetchMessagesResponse>(`/task/fetchConversation`, {
        params: { recipientUuid: targetProfileUuid }
      });
      return data.messages;
    },
    // Only fetch when the dock is actually open and we have a valid UUID
    enabled: isOpen && !!targetProfileUuid,
  });
};