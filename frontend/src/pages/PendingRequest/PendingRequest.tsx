import React, { useState } from "react";
import { usePendingRequests } from "@/components/PendingRequests/usePendingRequests";
import { PendingRequestList } from "@/components/PendingRequests/PendingRequestList";
import "@styles/Profile.css";

const Pending_Request: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { pendingRequests, mutation } = usePendingRequests();

  if (pendingRequests.length === 0) return null;

  return (
    <PendingRequestList
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      pendingRequests={pendingRequests}
      onAction={(targetUuid, action) => mutation.mutate({ targetUuid, action })}
    />
  );
};

export default Pending_Request;