import React from "react";
import { X, Sparkles, Bell } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts"; // Adjust path to your hook
import { useNavigate } from "react-router-dom";

interface MobileAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAlertsModal: React.FC<MobileAlertsModalProps> = ({ isOpen, onClose }) => {
  const { alerts, markAsRead } = useAlerts();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAlertClick = (alert: any) => {
    if (!alert.is_read) {
      markAsRead(alert.id);
    }
    onClose();
    navigate(`/task/${alert.reference_id}`);
  };

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />

      <div className="relative bg-[#09090b] border-t border-white/15 rounded-t-[32px] max-h-[85vh] flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#d4af37]" />
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
              Inner Circle Activity
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
              {unreadCount} unread
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* List of alerts */}
        <div className="overflow-y-auto divide-y divide-white/[0.04] p-2">
          {alerts.length === 0 ? (
            <div className="py-16 text-center">
              <Bell size={28} className="mx-auto text-white/20 mb-2" />
              <p className="text-xs font-mono text-white/40">
                No activity from your connections yet.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={`p-4 rounded-2xl transition-colors flex items-start gap-3 my-1 active:bg-white/[0.05] ${
                  !alert.is_read ? "bg-white/[0.03]" : "opacity-60"
                }`}
              >
                <img
                  src={alert.actor_avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={alert.actor_name}
                  className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                />

                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {alert.actor_name}
                    </span>
                    <span className="text-[9px] font-mono text-white/30">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-snug line-clamp-2">
                    Published a new reflection: <span className="italic text-white">"{alert.post_snippet || 'View post'}"</span>
                  </p>
                </div>

                {!alert.is_read && (
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0 self-center" />
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};