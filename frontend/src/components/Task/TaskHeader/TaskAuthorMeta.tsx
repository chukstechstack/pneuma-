import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToggleConnection } from "@/hooks/useConnections";
import { useTaskProfile } from "../../../hooks/useProfileSettings";
import { formatTaskDate } from "./utils";

interface TaskAuthorMetaProps {
  authorProfileUuid: string;
  authorName?: string | null;
  currentUserUuid: string;
  isConnected: boolean;
  createdAt?: string | null;
}

export const TaskAuthorMeta: React.FC<TaskAuthorMetaProps> = ({
  authorProfileUuid,
  authorName: initialAuthorName,
  currentUserUuid,
  isConnected: initialIsConnected,
  createdAt,
}) => {
  const [isConnected, setIsConnected] = useState(initialIsConnected);
  const { data: profile } = useTaskProfile(authorProfileUuid);
  const authorName = profile?.full_name || initialAuthorName;

  useEffect(() => {
    setIsConnected(initialIsConnected);
  }, [initialIsConnected]);

  const { mutate: toggleConnect, isPending } = useToggleConnection(authorProfileUuid);

  const handleClick = () => {
    if (isPending) return;
    const previousState = isConnected;
    setIsConnected(!previousState);

    toggleConnect(undefined, {
      onError: () => {
        setIsConnected(previousState);
      },
    });
  };

  return (
    <div className="flex flex-col justify-center min-h-[38px] font-sans">
      {/* Top Line: Username -> Separator -> Timestamp/Follow Action */}
      <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 leading-none">
        <Link 
          to={`/profile/${authorProfileUuid}`} 
          className="font-semibold text-white text-[14px] hover:text-white/80 transition-colors tracking-normal"
        >
          {authorName || "Sanctuary User"}
        </Link>

        {/* Inline Instagram-style dynamic timestamp */}
        {createdAt && (
          <>
            <span className="text-white/30 text-[13px] font-normal select-none">·</span>
            <span className="text-white/40 text-[13px] font-normal tracking-normal">
              {formatTaskDate(createdAt)}
            </span>
          </>
        )}

        {/* Dynamic Connection/Follow Button */}
        {currentUserUuid !== authorProfileUuid && (
          <>
            <span className="text-white/30 text-[13px] font-normal select-none">·</span>
            <button
              disabled={isPending}
              onClick={handleClick}
              className={`text-[13px] font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer inline-flex items-center gap-1 ${
                isConnected
                  ? "text-white/60 hover:text-red-400"  
                  : "text-[#3897f0] hover:text-[#287dc5]" // Classic IG feed blue highlight
              }`}
            >
              {isPending ? (
                <Loader2 size={11} className="animate-spin text-white/40" />
              ) : (
                isConnected ? "Following" : "Follow"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};