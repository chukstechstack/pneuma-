import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BookOpen,
  Plus,
  Bell,
  Search,
  MessageSquare
} from "lucide-react";
import { MobileMessagesModal } from "../Mobile/MessagesModal";
import { MobileAlertsModal } from "./MobileAlertsModal";
import { useAlerts } from "@/hooks/useAlerts";
import socket from "@/api/socketApi";

interface MobileNavBarProps {
  isVisible: boolean;
  userUuid: string | null;
  userAvatar?: string | null;
  pathname: string;
  onOpenCreate: () => void;
  onSelectConversation: (partnerUuid: string) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  isVisible,
  userUuid,
  userAvatar,
  pathname,
  onOpenCreate,
  onSelectConversation
}) => {
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  
  // 🔴 Live unread message count state
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>(0);

  // Listen for incoming messages globally to update badge
  useEffect(() => {
    const handleGlobalIncomingMessage = (incoming: any) => {
      if (incoming.senderUuid !== userUuid) {
        setUnreadMsgCount((prev) => prev + 1);
      }
    };

    socket.on("server:incoming_msg", handleGlobalIncomingMessage);

    return () => {
      socket.off("server:incoming_msg", handleGlobalIncomingMessage);
    };
  }, [userUuid]);

  const handleOpenInbox = () => {
    setUnreadMsgCount(0);
    setIsInboxOpen(true);
  };
  
  // Fetch alerts and calculate unread count
  const { alerts } = useAlerts();
  const unreadAlertsCount = alerts.filter((a) => !a.is_read).length;
  const hasUnreadAlerts = unreadAlertsCount > 0;

  const isActive = (path: string) => pathname.startsWith(path);

  const getMobileLinkClass = (path: string) => `
    flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200
    ${isActive(path)
      ? "text-[#d4af37] bg-[#d4af37]/10"
      : "text-white/40 hover:text-white/80"
    }
  `;

  return (
    <div className="md:hidden">

      {/* MOBILE TOP SLIM BAR: Search + 💬 Messages Button */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.06] px-4 py-2.5 flex items-center justify-between gap-3 transition-transform duration-300 ${!isVisible ? "-translate-y-full" : "translate-y-0"
          }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 w-full bg-[#121214] border border-white/10 rounded-full px-3.5 py-1.5 text-white/40 text-xs font-light">
            <Search size={14} className="text-[#d4af37]" />
            <span className="truncate">Search archive insights...</span>
          </div>
        </div>

        {/* 💬 Messages Inbox Button (TOP) */}
        <button
          onClick={handleOpenInbox}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.03] border border-white/10 text-white/80 cursor-pointer active:scale-95 transition-all shrink-0"
          aria-label="Messages"
        >
          <MessageSquare size={16} className={unreadMsgCount > 0 ? "text-[#d4af37]" : ""} />
          {unreadMsgCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-md animate-pulse">
              {unreadMsgCount}
            </span>
          )}
        </button>
      </nav>

      {/* MOBILE BOTTOM FLOATING DOCK: Home, Feed, Create, 🔔 Notifications, Profile */}
      <nav
        className={`fixed bottom-5 left-4 right-4 z-40 bg-[#121214]/90 backdrop-blur-2xl border border-white/[0.08] rounded-full px-3 py-2 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-transform duration-300 ${!isVisible ? "translate-y-28" : "translate-y-0"
          }`}
      >
        <Link to="/homefeed" className={getMobileLinkClass("/homefeed")}>
          <Home size={20} strokeWidth={isActive("/homefeed") ? 2 : 1.5} />
        </Link>

        <Link to={userUuid ? `/feed/${userUuid}` : "#"} className={getMobileLinkClass("/feed")}>
          <BookOpen size={20} strokeWidth={isActive("/feed") ? 2 : 1.5} />
        </Link>

        {/* Floating Center Create Action Link */}
        <Link
          to="/createtask"
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#aa8c2c] text-black shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <Plus size={20} strokeWidth={2.5} />
        </Link>

        {/* 🔔 Notifications / Alerts Button (BOTTOM next to Profile) */}
        <button
          onClick={() => setIsAlertsOpen(true)}
          className="relative flex items-center justify-center p-2 rounded-full text-white/40 hover:text-white/80 transition-all cursor-pointer"
          aria-label="Alerts"
        >
          <Bell size={20} strokeWidth={1.5} className={hasUnreadAlerts ? "text-[#d4af37]" : ""} />
          {hasUnreadAlerts && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#121214] animate-pulse pointer-events-none" />
          )}
        </button>

        {/* Profile / Journal Avatar Link */}
        <Link to="/profile" className={getMobileLinkClass("/profile")}>
          <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-[#d4af37]/60">
            <img
              src={userAvatar || "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+24%2C+2026%2C+04_24_39+PM.jpg"}
              className="w-full h-full object-cover"
              alt="Me Profile"
            />
          </div>
        </Link>
      </nav>

      {/* 📱 Modular Mobile Messages Drawer Modal */}
      <MobileMessagesModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        onSelectConversation={onSelectConversation}
      />

      {/* 🔔 Modular Mobile Alerts Drawer Modal */}
      <MobileAlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />

    </div>
  );
};