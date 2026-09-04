import React from "react";
import { Link } from "react-router-dom";
import { Users, X, Loader2 } from "lucide-react";
import { useConnections } from "@/hooks/useConnections";

interface ConnectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfileUuid: string;
}

export const ConnectionDrawer: React.FC<ConnectionDrawerProps> = ({ 
  isOpen, 
  onClose, 
  targetProfileUuid 
}) => {
  if (!isOpen) return null;

  const { data: myConnections = [], isLoading, isError } = useConnections(targetProfileUuid);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#ffffff] rounded-[32px] p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <h3 className="font-black text-xl sm:text-2xl tracking-tight text-[#161823]">
              Connections
            </h3>
            <span className="text-lg font-bold text-gray-400">
              {myConnections.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#161823] hover:text-[#fe2c55] transition-colors cursor-pointer"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[55vh] overflow-y-auto space-y-1 pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={28} className="text-[#fe2c55] animate-spin mb-2" />
              <p className="text-gray-400 text-sm font-medium">Syncing network...</p>
            </div>
          ) : isError ? (
            <p className="text-center py-10 text-[#fe2c55] text-sm font-medium">
              Failed to load connections.
            </p>
          ) : myConnections.length === 0 ? (
            <p className="text-center py-12 text-gray-400 text-sm font-medium">
              No connections yet.
            </p>
          ) : (
            myConnections.map((connectedUser: any) => (
              <Link
                key={connectedUser.uuid}
                to={`/profile/${connectedUser.uuid}`}
                onClick={onClose}
                className="flex items-center gap-3.5 py-3 group w-full"
              >
                <img
                  src={connectedUser.avatar_url || "https://unsplash.com"}
                  className="w-14 h-14 rounded-full object-cover shadow-sm shrink-0"
                  alt={connectedUser.full_name}
                />
                <div className="min-w-0">
                  <span className="text-base font-bold text-[#161823] group-hover:text-[#fe2c55] transition-colors block truncate">
                    {connectedUser.full_name}
                  </span>
                  <span className="text-sm text-gray-400 font-medium">Member</span>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
};