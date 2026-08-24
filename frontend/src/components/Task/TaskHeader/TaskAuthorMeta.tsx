import React from "react";
import { Link } from "react-router-dom";
import { Clock3, Loader2 } from "lucide-react";
import { useToggleConnection } from "@/hooks/useConnections";
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
  authorName,
  currentUserUuid,
  isConnected,
  createdAt,
}) => {
  const { mutate: toggleConnect, isPending } = useToggleConnection(authorProfileUuid);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${authorProfileUuid}`} className="font-semibold text-white text-sm hover:text-[#d4af37] transition-colors">
          {authorName || "Sanctuary User"}
        </Link>

        {currentUserUuid !== authorProfileUuid && (
          <>
            <span className="text-white/20 font-light">·</span>
            <button
              disabled={isPending}
              onClick={() => toggleConnect()}
              className={`text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1 ${
                isConnected
                  ? "text-emerald-400 hover:text-red-400"  
                  : "text-[#d4af37] hover:text-[#e5c05e]"   
              }`}
            >
              {isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                isConnected ? "Connected" : "Connect"
              )}
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
        <Clock3 size={11} className="text-white/30" />
        <span>{formatTaskDate(createdAt)}</span>
      </div>
    </div>
  );
};