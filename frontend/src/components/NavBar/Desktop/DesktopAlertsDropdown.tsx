import React, { useRef } from "react";
import { Sparkles, X } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { useNavigate } from "react-router-dom";

interface DesktopAlertsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopAlertsDropdown: React.FC<DesktopAlertsDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { alerts, markAsRead } = useAlerts();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAlertClick = (alert: any) => {
    if (!alert.is_read) {
      markAsRead(alert.id);
    }
    onClose();
    navigate(`/task/${alert.reference_id}`);
  };

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-3 z-[70]" ref={dropdownRef}>
      {/* Backdrop to close when tapping anywhere outside */}
      <div className="fixed inset-0 z-[60] bg-transparent" onClick={onClose} />
      
      {/* Dropdown panel */}
      <div className="relative w-80 sm:w-96 bg-[#09090b] border border-white/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2">
        
        {/* Header with Sparkles, Unread count, and explicit X Close button */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-[#d4af37]" />
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
              Inner Circle Activity
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/40 flex items-center gap-1.5">
              {unreadCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
              {unreadCount} unread
            </span>
            
            {/* Explicit X Close Button */}
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Close alerts"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Alert List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
          {alerts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs font-mono text-white/40">
                No activity from your connections yet.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={`p-4 transition-colors flex items-start gap-3 hover:bg-white/[0.03] cursor-pointer ${
                  !alert.is_read ? "bg-white/[0.02]" : "opacity-60"
                }`}
              >
                <img
                  src={alert.actor_avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={alert.actor_name}
                  className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
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
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 self-center animate-pulse" />
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};