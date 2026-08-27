import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import doveLogoUrl from "@assets/pneuma.png";
import { Home, Feather, BookOpen, Search, Bell } from "lucide-react";
import { DesktopMessagesDropdown } from "./MessagesDropdown";
import { DesktopAlertsDropdown } from "./DesktopAlertsDropdown";
import { useAlerts } from "@/hooks/useAlerts";
import socket from "@/api/socketApi";

interface DesktopNavBarProps {
  userUuid: string | null;
  userAvatar?: string | null;
  pathname: string;
  onOpenCreate: () => void;
  onSelectConversation: (partnerUuid: string) => void;
}

export const DesktopNavBar: React.FC<DesktopNavBarProps> = ({
  userUuid,
  userAvatar,
  pathname,
  onOpenCreate,
  onSelectConversation
}) => {
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  // 🔴 Live Unread Message Count State for Desktop Nav
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>(0);

  // Listen for incoming messages globally to update the desktop messages badge
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

  // Toggle inbox and clear unread badge when opened
  const handleToggleInbox = () => {
    if (!isInboxOpen) {
      setUnreadMsgCount(0);
    }
    setIsInboxOpen((prev) => !prev);
  };

  // Fetch alerts and calculate unread count directly
  const { alerts } = useAlerts();
  const unreadAlertsCount = alerts.filter((a) => !a.is_read).length;
  const hasUnreadAlerts = unreadAlertsCount > 0;

  const isActive = (path: string) => pathname.startsWith(path);

  const getLinkClasses = (path: string) => `
    relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200
    ${isActive(path)
      ? "text-[#d4af37] bg-[#d4af37]/10 font-semibold"
      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
    }
  `;

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-6 hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 bg-[#121214]/80 backdrop-blur-2xl border border-white/[0.08] rounded-full px-5 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">

        {/* Brand & Logo */}
        <Link to="/homefeed" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center p-1 group-hover:border-[#d4af37] transition-all">
            <img src={doveLogoUrl} className="w-full h-full object-contain filter drop-shadow" alt="Pneuma Logo" />
          </div>
          <span className="font-serif text-base font-bold tracking-[0.15em] text-white/90 uppercase">
            Pneuma
          </span>
        </Link>

        {/* Search */}
        <div className="relative max-w-xs w-full mx-2">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            id="desktop-search"
            name="desktop-search"
            type="text"
            placeholder="Search archive insights..."
            className="w-full bg-[#09090b]/60 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-all font-normal"
          />
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          <Link to="/homefeed" className={getLinkClasses("/homefeed")}>
            <Home size={15} strokeWidth={isActive("/homefeed") ? 2 : 1.5} />
            <span>Home</span>
          </Link>

          {/* 🌟 Upgraded Share/Publish Button with Feather Icon */}
          <Link
            to="/createtask"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:opacity-95 transition-all active:scale-95 ml-1"
          >
            <Feather size={15} strokeWidth={2.2} />
            <span>Publish</span>
          </Link>
          
          <Link to={`/feed/${userUuid || "archive"}`} className={getLinkClasses("/feed")}>
            <BookOpen size={15} strokeWidth={isActive("/feed") ? 2 : 1.5} />
            <span>Archive</span>
          </Link>

          {/* Messages Dropdown Component */}
          <DesktopMessagesDropdown
            isOpen={isInboxOpen}
            onToggle={handleToggleInbox}
            onClose={() => setIsInboxOpen(false)}
            onSelectConversation={(partnerUuid) => {
              setUnreadMsgCount(0);
              onSelectConversation(partnerUuid);
            }}
            getLinkClasses={getLinkClasses}
            unreadCount={unreadMsgCount}
            setUnreadCount={setUnreadMsgCount}
          />

          {/* 🔔 Standalone Navbar Alerts Button & Dropdown Integration */}
          <div className="relative">
            <button
              onClick={() => setIsAlertsOpen((prev) => !prev)}
              className={getLinkClasses("/notifications")}
            >
              <div className="relative flex items-center">
                <Bell size={15} strokeWidth={isAlertsOpen ? 2 : 1.5} className={hasUnreadAlerts ? "text-[#d4af37]" : ""} />
                
                {hasUnreadAlerts && (
                  <span className="absolute -top-1.5 -right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#121214] animate-pulse pointer-events-none" />
                )}
              </div>
              <span className="ml-1">Alerts</span>
            </button>

            {/* Separate Dropdown Modal Component */}
            <DesktopAlertsDropdown
              isOpen={isAlertsOpen}
              onClose={() => setIsAlertsOpen(false)}
            />
          </div>

          <Link to="/profile" className={getLinkClasses("/profile")}>
            <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-[#d4af37]/50">
              <img
                src={userAvatar || "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+24%2C+2026%2C+04_24_39+PM.jpg"}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            <span>Profile</span>
          </Link>

          <div className="w-px h-4 bg-white/10 mx-1" />

        </nav>

      </div>
    </header>
  );
};