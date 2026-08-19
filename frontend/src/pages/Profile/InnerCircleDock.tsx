import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Users, X } from "lucide-react";
import { RootState } from "../../store/ReduxStore"; // Adjust this import path if needed

interface InnerCircleDockProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InnerCircleDock: React.FC<InnerCircleDockProps> = ({ isOpen, onClose }) => {
  // 🛡️ Safety Guard: If it's not open, render absolutely nothing
  if (!isOpen) return null;

  // 🪄 Gather all connected profiles straight out of Redux memory
  const myConnections = useSelector((state: RootState) => 
    Object.values(state.follows.followingStatus).filter(Boolean)
  );

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
          {myConnections.length === 0 ? (
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
                  onClick={onClose} // Closes the drawer automatically when you hop to their profile
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
