import React from "react";
import { Link } from "react-router-dom";
import { Users, X, Loader2 } from "lucide-react";
import { useConnections } from "@/hooks/useConnections"; // 👈 Your new database hook

interface ConnectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfileUuid: string; // 👈 Pass the profile whose connections we want to view
}

export const ConnectionDrawer: React.FC<ConnectionDrawerProps> = ({ 
  isOpen, 
  onClose, 
  targetProfileUuid 
}) => {
  // 🛡️ Safety Guard: If it's not open, render absolutely nothing
  if (!isOpen) return null;

  // 📦 Fetch connections straight from PostgreSQL via React Query
  const { data: myConnections = [], isLoading, isError } = useConnections(targetProfileUuid);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#09090b] border border-white/[0.12] rounded-3xl p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Block */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-[#d4af37]" />
            <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-white">
              Connections
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-[#d4af37] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrolling List Frame */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 size={24} className="text-[#d4af37] animate-spin mb-2" />
              <p className="text-gray-400 text-xs font-mono">Loading connections...</p>
            </div>
          ) : isError ? (
            <p className="text-center py-10 text-red-400 text-sm font-mono">
              Failed to load connections.
            </p>
          ) : myConnections.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm font-mono">
              No connections found in this inner circle yet.
            </p>
          ) : (
            myConnections.map((connectedUser: any) => (
              <div 
                key={connectedUser.uuid} 
                className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#d4af37]/40 transition-all"
              >
                <Link 
                  to={`/profile/${connectedUser.uuid}`} 
                  onClick={onClose} 
                  className="flex items-center gap-3.5 group"
                >
                  <img
                    src={connectedUser.avatar_url || "https://unsplash.com"}
                    className="w-11 h-11 rounded-full object-cover border border-[#d4af37]/30 group-hover:border-[#d4af37] transition-colors"
                    alt={connectedUser.full_name}
                  />
                  <span className="text-sm font-semibold text-white group-hover:text-[#d4af37] transition-colors">
                    {connectedUser.full_name}
                  </span>
                </Link>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};