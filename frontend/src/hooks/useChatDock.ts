import { useState, useEffect } from "react";
import { useFetchMessages } from "./useFetchMessages";
import socket from "@/api/socketApi";
import { useAuthStore } from "@store/useAuthStore";

export const useChatDock = (targetProfileUuid: string, isOpen: boolean) => {
  const { userUuid: currentUserUuid } = useAuthStore() as { userUuid: string | null };
  const [inputMessage, setInputMessage] = useState("");
  
  // Fetch initial history
  const { data: initialMessages = [], isLoading, isError } = useFetchMessages(targetProfileUuid, isOpen);
  
  // Local message state
  const [messages, setMessages] = useState<Array<any>>([]);

  // Sync initial fetched messages into local state when they load
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Listen for live incoming messages and acknowledgments
  useEffect(() => {
    if (!isOpen) return;

    const handleReceiveMessage = (incoming: any) => {
      if (incoming.senderUuid === targetProfileUuid || incoming.senderUuid === currentUserUuid) {
        setMessages((prev) => [...prev, incoming]);
      }
    };

    const handleMessageAcknowledged = ({ tempId, messageId, createdAt }: any) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.tempId === tempId ? { ...msg, id: messageId, createdAt, pending: false } : msg))
      );
    };

    socket.on("server:receive_message", handleReceiveMessage);
    socket.on("server:message_acknowledged", handleMessageAcknowledged);

    return () => {
      socket.off("server:receive_message", handleReceiveMessage);
      socket.off("server:message_acknowledged", handleMessageAcknowledged);
    };
  }, [isOpen, targetProfileUuid, currentUserUuid]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentUserUuid) return;

    const tempId = `temp-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const optimisticMessage = {
      id: tempId,
      tempId,
      senderUuid: currentUserUuid,
      content: inputMessage.trim(),
      createdAt,
      pending: true,
    };

    // 1. Optimistic UI update
    setMessages((prev) => [...prev, optimisticMessage]);
    const messageContent = inputMessage.trim();
    setInputMessage("");

    // 2. Emit to backend gateway
    socket.emit("client:send_message", {
      recipientUuid: targetProfileUuid,
      content: messageContent,
      tempId,
    });
  };

  return {
    currentUserUuid,
    inputMessage,
    setInputMessage,
    messages,
    isLoading,
    isError,
    handleSendMessage,
  };
};