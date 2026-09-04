import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Compass,
  Plus,
  MessageCircle,
  Search,
  X
} from "lucide-react";
import { MobileMessagesModal } from "../Mobile/MessagesModal";
import socket from "@/api/socketApi";

interface MobileNavBarProps {
  isVisible: boolean;
  forceHideNavBar?: boolean;
  userUuid: string | null;
  userAvatar?: string | null;
  pathname: string;
  onOpenCreate: () => void;
  onSelectConversation: (partnerUuid: string) => void;
  onSearchQuery?: (query: string) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  isVisible,
  forceHideNavBar = false,
  userUuid,
  userAvatar,
  pathname,
  onOpenCreate,
  onSelectConversation,
  onSearchQuery,
}) => {
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>(0);

  const isProfilePage = pathname.includes("/profile") || (userUuid ? pathname.includes(`/feed/${userUuid}`) : false);
  const shouldHide = !isVisible || forceHideNavBar || isProfilePage;

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchQuery) onSearchQuery(val);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    if (onSearchQuery) onSearchQuery("");
  };

  const isActive = (path: string) => pathname.startsWith(path);

  const getMobileLinkClass = (path: string) => `
    w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0
    ${isActive(path)
      ? "text-white font-bold bg-white/10"
      : "text-white/60 hover:text-white hover:bg-white/5"
    }
  `;

  return (
    <div className="md:hidden">
      {/* TOP BAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 px-5 py-3.5 flex items-center justify-between pointer-events-none transform-gpu transition-transform duration-300 ${
          shouldHide ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="pointer-events-auto">
          <span className="text-white font-extrabold text-base tracking-widest"></span>
        </div>

        <div className="pointer-events-auto flex items-center">
          {isSearchOpen ? (
            <div className="flex items-center gap-2 bg-[#121214] border border-white/15 rounded-full px-4 py-2 text-white text-xs w-[240px]">
              <Search size={18} strokeWidth={3} className="text-white shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search archive..."
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/40 text-xs font-medium"
              />
              <button onClick={closeSearch} className="text-white/60 hover:text-white cursor-pointer p-0.5">
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Open Search"
            >
              <Search size={22} strokeWidth={3} />
            </button>
          )}
        </div>
      </nav>

      {/* BOTTOM DOCK */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[#09090b] border-t border-white/10 px-4 pt-2 pb-5 flex items-center justify-around transform-gpu transition-transform duration-300 ${
          shouldHide ? "translate-y-28" : "translate-y-0"
        }`}
      >
        <Link to="/homefeed" className={getMobileLinkClass("/homefeed")} aria-label="Home">
          <Home size={26} strokeWidth={isActive("/homefeed") ? 2.75 : 2.25} />
        </Link>

        <Link to={userUuid ? `/feed/${userUuid}` : "#"} className={getMobileLinkClass("/feed")} aria-label="Journal">
          <Compass size={26} strokeWidth={isActive("/feed") ? 3 : 2.25} />
        </Link>

        {/* TikTok-style Center Create Button */}
        <Link
          to="/createtask"
          className="relative w-11 h-8 rounded-xl bg-white text-black flex items-center justify-center cursor-pointer shrink-0 active:scale-95 transition-all shadow-[0_0_12px_rgba(255,255,255,0.25)] hover:bg-white/90"
          aria-label="Create Dispatch"
        >
          <Plus size={22} strokeWidth={3.5} />
        </Link>

        <button
          onClick={handleOpenInbox}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            isInboxOpen ? "text-white font-bold bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
          aria-label="Inbox"
        >
          <MessageCircle size={26} strokeWidth={unreadMsgCount > 0 ? 3 : 2.25} className={unreadMsgCount > 0 ? "text-white" : ""} />
          {unreadMsgCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#fe2c55] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full pointer-events-none">
              {unreadMsgCount}
            </span>
          )}
        </button>

        <Link to="/profile" className="w-10 h-10 flex items-center justify-center transition-colors shrink-0" aria-label="Profile">
          <div className={`w-9 h-9 rounded-full overflow-hidden transition-all ${isActive("/profile") ? "ring-2 ring-white" : "ring-1 ring-white/40 opacity-80 hover:opacity-100"}`}>
            <img
              src={userAvatar || "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+24%2C+2026%2C+04_24_39+PM.jpg"}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>
        </Link>
      </nav>

      <MobileMessagesModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        onSelectConversation={onSelectConversation}
      />
    </div>
  );
};