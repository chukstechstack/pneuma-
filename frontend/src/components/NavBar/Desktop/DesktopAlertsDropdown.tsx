import React from "react";
import { Bell, Sparkles } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { useNavigate } from "react-router-dom";

interface DesktopAlertsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  getLinkClasses: (path: string) => string;
}

export const DesktopAlertsDropdown: React.FC<DesktopAlertsDropdownProps> = ({
  isOpen,
  onToggle,
  onClose,
  getLinkClasses,
}) => {
  const { alerts, hasUnread, markAsRead } = useAlerts();
  const navigate = useNavigate();

  const handleAlertClick = (alert: any) => {
    if (!alert.is_read) {
      markAsRead(alert.id);
    }
    onClose();
    navigate(`/task/${alert.reference_id}`);
  };

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  return (
    <div className="relative">
      {/* Navbar Trigger Button matching your getLinkClasses styling */}
      <button onClick={onToggle} className={getLinkClasses("/notifications")}>
        <div className="relative flex items-center">
          <Bell size={15} strokeWidth={isOpen ? 2 : 1.5} />
          {hasUnread && (
            <span className="absolute -top-1.5 -right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#010102] animate-pulse" />
          )}
        </div>
        <span className="ml-1">Alerts</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#09090b] border border-white/15 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[#d4af37]" />
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">
                  Inner Circle Activity
                </h4>
              </div>
              <span className="text-[10px] font-mono text-white/40">
                {unreadCount} unread
              </span>
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
                      <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0 self-center" />
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};